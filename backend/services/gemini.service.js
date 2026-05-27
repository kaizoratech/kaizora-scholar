const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

function getApiKey() {
    try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
            if (envConfig.GEMINI_API_KEY) {
                return envConfig.GEMINI_API_KEY.trim();
            }
        }
    } catch (e) {
        console.warn('[Gemini Service] Failed to dynamically hot-reload .env file:', e.message);
    }
    return process.env.GEMINI_API_KEY || '';
}

// Helper delay generator for Circuit Breaker
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * ── HELPER LAYER: DATA MINIMIZATION (extractAcademicText) ──────────────────
 * Strips non-academic blocks and redundant HTML attributes from payloads.
 * This cuts token count down by up to 80% to avoid Gateway Timeouts.
 * Defined outside class context to bypass memory/closure retention traps.
 */
function extractAcademicText(htmlPayload) {
    if (!htmlPayload || typeof htmlPayload !== 'string') return '';

    let $ = cheerio.load(htmlPayload);

    // Strip navigation, footer, forms, style and script elements
    $('nav, footer, script, style, form, header, iframe, noscript').remove();

    const textBlocks = [];

    // Extract text ONLY from target educational tags
    $('p, li, h1, h2, h3, blockquote').each((_, el) => {
        // Strip attributes (classes, IDs, styles) to keep token payload raw
        $(el).removeAttr('class');
        $(el).removeAttr('id');
        $(el).removeAttr('style');

        const blockText = $(el).text().trim();
        if (blockText) {
            textBlocks.push(blockText);
        }
    });

    $ = null; // Instantly null Cheerio reference for V8 Garbage Collection scavenging

    return textBlocks.join('\n\n');
}

/**
 * Executes content generation via raw REST API requests using candidate models.
 * Bypasses deprecated SDK client library version issues completely.
 */
async function generateWithModelFallback(promptOrParts, generationConfig = {}) {
    const modelsToTry = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-3.5-flash',
        'gemini-3-flash-preview',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-flash-lite-latest',
        'gemini-2.0-flash',
        'gemini-2.5-pro',
        'gemini-pro-latest',
        'gemini-3.1-pro-preview'
    ];
    const errors = [];

    let parts = [];
    if (Array.isArray(promptOrParts)) {
        parts = promptOrParts;
    } else {
        parts = [{ text: promptOrParts }];
    }

    for (const modelName of modelsToTry) {
        try {
            console.log(`[AI REST Service] Attempting content generation with: ${modelName}`);
            
            const currentApiKey = getApiKey();
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentApiKey}`;
            
            const response = await axios.post(url, {
                contents: [
                    {
                        parts: parts
                    }
                ],
                generationConfig: generationConfig
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 120000 // Increased to 120s to allow Gemini ample time for multimodal PDF processing
            });

            const candidate = response.data?.candidates?.[0];
            const responseText = candidate?.content?.parts?.[0]?.text;
            const tokenCount = response.data?.usageMetadata?.totalTokenCount || (responseText ? Math.floor(responseText.length / 4) + 1500 : 4500);

            if (responseText && responseText.trim().length > 0) {
                console.log(`[AI REST Service] Generation successful using: ${modelName} (${tokenCount} tokens)`);
                return { text: responseText.trim(), tokenCount };
            } else {
                throw new Error('Received empty response payload from REST API.');
            }
        } catch (err) {
            const apiErrorMsg = err.response?.data?.error?.message || err.message;
            errors.push({ modelName, error: apiErrorMsg });
            console.warn(`[AI REST Service] Model ${modelName} failed:`, apiErrorMsg);

            // If it is a rate limit or quota exceeded, wait longer before trying next model
            if (apiErrorMsg.includes('429') || apiErrorMsg.includes('quota') || apiErrorMsg.includes('Quota') || apiErrorMsg.includes('limit')) {
                console.log(`[AI REST Service] Rate limit detected on ${modelName}. Waiting 5s before next model...`);
                await sleep(5000);
                continue;
            }
            
            await sleep(1500);
        }
    }

    const quotaError = errors.find(e => e.error.includes('quota') || e.error.includes('Quota') || e.error.includes('429') || e.error.includes('limit') || e.error.includes('Limit'));
    if (quotaError) {
        throw new Error(`Batas Kuota / Rate Limit terlampaui pada API Key Anda (Model: ${quotaError.modelName}). Detail: ${quotaError.error}`);
    }

    const errorDetails = errors.map(e => `[${e.modelName}]: ${e.error}`).join(' | ');
    throw new Error(`Semua model Gemini gagal merespons. Detail: ${errorDetails}`);
}

class GeminiService {
    /**
     * Parse text payload into sanitized academic chunks using data minimization.
     * @param {string} rawHtml 
     * @returns {string} Sanitized academic text
     */
    static sanitizeHtml(rawHtml) {
        return extractAcademicText(rawHtml);
    }

    /**
     * Synthesize core material summaries using the Pareto 20-80 principle.
     * Returns Markdown directly with absolute zero system conversational prefixes/suffixes.
     */
    static async synthesizeMaterial(sanitizedText) {
        const fallbackText = 'Sistem AI sibuk. Silakan muat ulang ringkasan ini nanti.';
        const currentApiKey = getApiKey();

        if (!currentApiKey) {
            return fallbackText;
        }

        const cleanText = (sanitizedText || '').trim();
        if (!cleanText) {
            return 'Tidak ada konten materi teks untuk dirangkum.';
        }

        const prompt = `
System Instruction:
Kamu adalah mesin pengekstraksi kognitif yang memproses materi akademis Universitas Terbuka.
Terapkan prinsip Pareto: Ekstrak 20% esensi inti yang merepresentasikan 80% pemahaman materi.
Kembalikan HASIL AKHIR berupa format Markdown absolut langsung ke intinya.
DILARANG keras menyertakan kalimat pembuka, prolog, epilog, atau komentar tambahan seperti "Berikut ringkasannya:".
Tulis langsung judul pertamanya sebagai Heading Markdown.

Materi Kuliah yang akan diekstraksi:
---
${cleanText.slice(0, 30000)}
---
`.trim();

        try {
            const res = await generateWithModelFallback(prompt);
            return res.text;
        } catch (err) {
            console.error('[AI REST Service] synthesizeMaterial failed completely across all models:', err.message);
            return fallbackText;
        }
    }

    /**
     * Generate highly contextual academic drafts for forums or assignments.
     */
    static async generateTaskDraft(task, sessionContext, academicDetails = {}, pdfAttachments = []) {
        const fallbackText = 'Sistem AI sibuk. Silakan muat ulang draf ini nanti.';
        const currentApiKey = getApiKey();

        if (!currentApiKey) {
            return fallbackText;
        }

        const isTugas = task.type === 'Tugas';
        
        // Strip NIM prefix from name (e.g. "054308893 FADJAR SETIAWAN" -> "FADJAR SETIAWAN")
        const name = (academicDetails.name || 'Fadjar Setiawan').replace(/^\d+\s+/, '').trim();
        const nim = academicDetails.nim || '054308893';
        const prodi = academicDetails.prodi || 'Sistem Informasi';

        // Extract number from task title (e.g. "Tugas.2 Assignment" -> "2")
        let taskNum = '1';
        const numMatch = task.title.match(/tugas\s*[.\-_]?\s*(\d+)/i);
        if (numMatch) {
            taskNum = numMatch[1];
        }
        
        // Extract course name from sessionContext if possible, or fall back to selected course
        let courseName = '';
        const courseMatch = sessionContext.match(/Mata Kuliah:\s*(.*?)(?:\n|$)/i);
        if (courseMatch) {
            courseName = courseMatch[1].trim();
        }

        const title = isTugas ? `Tugas ${taskNum} - ${courseName || 'Belajar di Era Digital'}` : (task.title || 'Tugas');

        let prompt = '';
        if (isTugas) {
            prompt = `
System Instruction:
Kamu adalah mahasiswa aktif Universitas Terbuka yang sedang mengerjakan Tugas Akademik resmi.
Tugas: Buat lembar jawaban tugas yang sangat terstruktur, formal, analitis, dan berbobot akademis tinggi.

Gaya Penulisan & Struktur:
- Tulis langsung jawaban secara formal tanpa basa-basi pembuka robotik (seperti "Berikut adalah jawaban saya:") dan DILARANG keras memberikan salam pembuka chat (seperti "Halo teman-teman", "Selamat pagi", dsb).
- Format Lembar Jawaban harus diawali dengan informasi mahasiswa di paling atas teks EXACTLY seperti format di bawah ini:
${title}
Nama: ${name}
NIM: ${nim}
Prodi: ${prodi}

[Kemudian berikan spasi kosong, lalu langsung masuk ke isi jawaban/solusi secara analitis dan terstruktur sesuai nomor urut pertanyaan/instruksi jika ada]

- Berikan argumentasi akademis yang kuat, definisi konsep yang jelas, dan contoh nyata yang relevan.
- Gunakan bahasa Indonesia baku dan ilmiah (akademis).
- Hindari penggunaan format Markdown tebal yang berlebihan di dalam isi jawaban, namun buat pemisah antar-soal yang sangat rapi.

${pdfAttachments && pdfAttachments.length > 0 ? `BACA DAN ANALISIS FILE PDF LAMPIRAN TUGAS DENGAN SANGAT TELITI. File PDF tersebut berisi lembar soal dan instruksi pengerjaan tugas asli yang diunggah oleh dosen/tutor. Bacalah seluruh soal di dalam PDF tersebut, jawablah seluruh pertanyaan yang diajukan secara mendalam dan berurutan sesuai nomor soal, serta patuhi instruksi pengerjaan di dalam berkas PDF tersebut.` : ''}

Konteks Sesi Kuliah:
${sessionContext || 'Materi sesi terlampir.'}

Pertanyaan / Instruksi Tugas:
${task.description || task.title}
`.trim();
        } else {
            prompt = `
System Instruction:
Kamu adalah mahasiswa aktif Universitas Terbuka yang sedang berdiskusi secara organik, santun, dan akademis.
Tugas: Buat balasan diskusi yang logis, berargumentasi kuat, dan terstruktur berdasarkan topik di bawah.
Gaya Penulisan:
- Tulis secara ALAMI dan NATURAL, persis seperti ketikan manual manusia biasa di forum chat kuliah.
- DILARANG keras menggunakan format Markdown (seperti double asterisks ** untuk menebalkan teks, atau single asterisks * / garis bawah _ untuk teks miring).
- DILARANG keras membuat outline yang tampak seperti buatan robot.
- Jika membuat poin-poin, gunakan angka biasa (1, 2, 3) atau tanda hubung biasa (-) secara manual tanpa kode tebal.
- Tulis langsung jawabannya tanpa kata pembuka basa-basi robotik (seperti "Berikut adalah jawaban saya:").
- Jika topik atau pertanyaan meminta data tabel (misalnya tabel transaksi, itemset, support, confidence, dsb), buatlah tabel tersebut menggunakan format tabel teks biasa (ASCII Table) menggunakan karakter pembatas garis seperti | dan - secara sangat rapi, bersih, dan lurus tanpa menggunakan format markdown tebal atau miring.
- DILARANG menyandingkan titik dua (:) langsung dengan tanda kurung tutup ()) seperti "(site:)" karena akan otomatis diterjemahkan menjadi emoticon smile oleh beberapa parser chat. Berikan spasi pemisah, misalnya "(site: )" atau gunakan tanda kutip "site:".

Konteks Sesi Kuliah:
${sessionContext || 'Materi sesi terlampir.'}

Pertanyaan / Instruksi Tugas:
${task.description || task.title}
`.trim();
        }

        // Formulate request parts
        const parts = [];
        if (pdfAttachments && pdfAttachments.length > 0) {
            for (const pdf of pdfAttachments) {
                console.log(`[AI REST Service] Feeding PDF attachment to model content array: ${pdf.name}`);
                parts.push({
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: pdf.base64
                    }
                });
            }
        }
        parts.push({ text: prompt });

        try {
            const res = await generateWithModelFallback(parts, {
                temperature: isTugas ? 0.25 : 0.35 // Slightly lower temperature for tasks to remain highly logical & analytical
            });

            let draftText = res.text;
            const tokenCount = res.tokenCount || 4500;

            if (draftText && draftText !== fallbackText) {
                // Post-process regex filter to guarantee a 100% natural, markdown-free output for both Diskusi and Tugas
                draftText = draftText
                    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold **
                    .replace(/\*(.*?)\*/g, '$1')     // Remove markdown italics *
                    .replace(/_(.*?)_/g, '$1')       // Remove markdown italics _
                    .replace(/^\s*\*\s+/gm, '- ')   // Convert markdown list bullet * to simple hyphen -
                    .replace(/`([^`]+)`/g, '$1')     // Remove inline code ticks
                    .replace(/sitesmile/gi, 'site:')
                    .replace(/filetypesmile/gi, 'filetype:')
                    .replace(/site:\s*\)/gi, 'site: )')
                    .replace(/filetype:\s*\)/gi, 'filetype: )');
            }

            return { text: draftText, tokenCount };
        } catch (err) {
            console.error('[AI REST Service] generateTaskDraft failed completely across all models:', err.message);
            return { text: fallbackText, tokenCount: 0 };
        }
    }

    /**
     * FASE 2: AKTIVASI OTAK (Generate 1 Socratic Question based on task context and user form context)
     */
    static async generateSocraticQuestion(task, sessionContext, contextForm) {
        const currentApiKey = getApiKey();
        if (!currentApiKey) return 'Sistem AI sibuk. Gagal membuat soal uji nalar.';

        const prompt = `
System Instruction: [SOAL UJI NALAR GENERATOR]
Kamu adalah asisten dosen Universitas Terbuka yang cerdas dan kritis. 
Tugasmu adalah membuat TEPAT SATU (1) pertanyaan pemicu argumen (Socratic Question) berbasis studi kasus/logika berdasarkan instruksi tugas kuliah dan masukan dari form konteks mahasiswa.

Tujuan:
Memastikan mahasiswa memahami materi dasar dan memicu logika orisinal mereka untuk kita serap ke dalam tulisan tugas nantinya. Pertanyaan tidak boleh berbentuk pilihan ganda, melainkan pertanyaan reflektif yang memerlukan jawaban logis/argumen singkat.

Format Keluaran:
Kembalikan TEPAT SATU pertanyaan langsung tanpa basa-basi pembuka (jangan ada kalimat pembuka seperti "Tentu, ini soal uji nalar Anda:" atau "Berikut adalah pertanyaannya:"). Tulis langsung pertanyaannya secara padat, tajam, dan relevan dengan materi kuliah dan konteks mahasiswa.

Konteks Sesi Kuliah & Instruksi Tugas:
${sessionContext}
Deskripsi Tugas: ${task.description || task.title}

Form Konteks Mahasiswa:
- Gaya Tulisan yang Diinginkan: ${contextForm.style || 'Analitis-Tajam'}
- Sudut Pandang/Keresahan Pribadi: ${contextForm.perspective || 'Tidak ada'}
- Contoh Nyata/Lokal Sekitar: ${contextForm.localExample || 'Tidak ada'}
`.trim();

        try {
            const res = await generateWithModelFallback(prompt, { temperature: 0.7 });
            return res.text || 'Gagal membuat soal uji nalar. Silakan coba lagi.';
        } catch (err) {
            console.error('[Gemini Service] generateSocraticQuestion failed:', err.message);
            return 'Gagal membuat soal uji nalar. Silakan coba lagi.';
        }
    }

    /**
     * FASE 3: EVALUASI & GENERATE (HUMANIZED OUTPUT RULES)
     */
    static async generateHumanizedTaskDraft(task, sessionContext, academicDetails, pdfAttachments = [], contextForm, socraticQuestion, socraticAnswer) {
        const currentApiKey = getApiKey();
        if (!currentApiKey) return { text: 'Sistem AI sibuk. Gagal membuat draf tugas.', tokenCount: 0 };

        const isTugas = task.type === 'Tugas';
        
        const name = (academicDetails.name || 'Fadjar Setiawan').replace(/^\d+\s+/, '').trim();
        const nim = academicDetails.nim || '054308893';
        const prodi = academicDetails.prodi || 'Sistem Informasi';

        let taskNum = '1';
        const numMatch = task.title.match(/tugas\s*[.\-_]?\s*(\d+)/i);
        if (numMatch) {
            taskNum = numMatch[1];
        }
        
        let courseName = '';
        const courseMatch = sessionContext.match(/Mata Kuliah:\s*(.*?)(?:\n|$)/i);
        if (courseMatch) {
            courseName = courseMatch[1].trim();
        }

        const title = isTugas ? `Tugas ${taskNum} - ${courseName || 'Belajar di Era Digital'}` : (task.title || 'Tugas');

        const systemInstruction = `
[SYSTEM INSTRUCTION: HUMANIZED ACADEMIC ARCHITECT]

Kamu adalah mahasiswa aktif Universitas Terbuka yang sangat cerdas, kritis, dan memiliki gaya penulisan orisinal manusia.
Tugas: Buat draf lembar jawaban tugas atau balasan diskusi kuliah yang sangat berbobot, orisinal, dan 100% lolos deteksi AI.

=======================================================
PROSES GENERATE - ATURAN PENULISAN ALAMI MANUSIA (WAJIB DIPATUHI):
=======================================================
1. **Suntikkan Data Murni Mahasiswa**:
   Integrasikan secara mendalam sudut pandang personal, contoh lokal, dan argumen sensitivitas harga/pemikiran orisinal mahasiswa dari form konteks dan jawaban soal uji nalar mereka ke dalam inti tulisan. Tulisan harus terasa ditulis oleh seseorang yang benar-benar melakukan observasi nyata di lapangan, bukan hasil kompilasi internet.
   - Gaya Tulisan: ${contextForm.style}
   - Sudut Pandang/Keresahan Pribadi: ${contextForm.perspective}
   - Contoh Nyata/Lokal: ${contextForm.localExample}
   - Soal Uji Nalar Diberikan: ${socraticQuestion}
   - Jawaban Logika Mahasiswa: ${socraticAnswer}

2. **Gunakan Struktur Non-Linear (Aliran Alami)**:
   Jangan gunakan template AI yang kaku (DILARANG Keras menyertakan sub-judul template robotik seperti "Pendahuluan", "Analisis", "Kesimpulan", atau "Faktor-Faktor" kecuali diminta secara eksplisit). Biarkan paragraf mengalir menggunakan kalimat transisi alami manusia (misal: "Namun, kalau kita bedah lebih dalam...", "Menariknya, fenomena ini justru...", "Dari sini kita bisa melihat bahwa...").

3. **Variasi Panjang Kalimat (Burstiness & Ritme Acak)**:
   Tulis dengan ritme tulisan manusia asli yang dinamis. Campurkan kalimat-kalimat panjang yang kompleks dan analitis dengan kalimat-kalimat pendek yang tegas, lugas, dan langsung menyentuh sasaran.

4. **Hindari Mutlak "Kata Kunci AI"**:
   DILARANG keras menggunakan kata-kata klise robotik AI seperti:
   - "Penting untuk diingat"
   - "Secara keseluruhan"
   - "Dalam era digital ini"
   - "Signifikan"
   - "Menakjubkan"
   - "Ranah"
   Ganti seluruh kosakata tersebut dengan kata sehari-hari yang biasa digunakan mahasiswa dalam diskusi ilmiah yang luwes dan cerdas.

5. **Anti-Kesimpulan Sempurna**:
   DILARANG menutup tulisan dengan kesimpulan moral anak pramuka yang normatif, membosankan, dan klise. Akhiri paragraf penutup dengan pernyataan reflektif yang tajam, pertanyaan terbuka yang memancing pemikiran lebih lanjut, atau penegasan argumen utama yang kuat secara persuasif.

6. **Format & Informasi Identitas (Khusus Tipe Tugas)**:
   - Jika ini adalah Tugas Resmi, diawali dengan header informasi mahasiswa berikut di baris paling atas teks EXACTLY seperti format ini:
   ${title}
   Nama: ${name}
   NIM: ${nim}
   Prodi: ${prodi}
   
   - Jika ini adalah Diskusi Forum, DILARANG mencantumkan header identitas formal di atas. Dan tulis langsung jawabannya tanpa kata pembuka basa-basi robotik (seperti "Berikut adalah jawaban saya:"). Jika topik meminta tabel, buatlah dengan ASCII Table biasa secara rapi.
   
   - DILARANG menggunakan format Markdown tebal yang berlebihan (asterisks **), buatlah tulisan bersih mengalir tanpa hiasan tebal/miring.
`;

        const prompt = `
${systemInstruction}

Konteks Sesi Kuliah & Materi Akademis:
${sessionContext}

Pertanyaan / Instruksi Tugas Asli:
${task.description || task.title}

${pdfAttachments && pdfAttachments.length > 0 ? `BACA DAN ANALISIS FILE PDF LAMPIRAN TUGAS BERIKUT UNTUK MENJAWAB PERTANYAAN SECARA MENDALAM.` : ''}
`.trim();

        // Formulate request parts
        const parts = [];
        if (pdfAttachments && pdfAttachments.length > 0) {
            for (const pdf of pdfAttachments) {
                parts.push({
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: pdf.base64
                    }
                });
            }
        }
        parts.push({ text: prompt });

        try {
            const res = await generateWithModelFallback(parts, {
                temperature: isTugas ? 0.4 : 0.65 // Slightly higher temperature for organic variety, while preserving logic
            });

            let draftText = res.text;
            const tokenCount = res.tokenCount || 4500;

            if (draftText) {
                // Post-process regex filter to guarantee a 100% natural, markdown-free output
                draftText = draftText
                    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold **
                    .replace(/\*(.*?)\*/g, '$1')     // Remove markdown italics *
                    .replace(/_(.*?)_/g, '$1')       // Remove markdown italics _
                    .replace(/^\s*\*\s+/gm, '- ')   // Convert markdown list bullet * to simple hyphen -
                    .replace(/`([^`]+)`/g, '$1')     // Remove inline code ticks
                    .replace(/sitesmile/gi, 'site:')
                    .replace(/filetypesmile/gi, 'filetype:')
                    .replace(/site:\s*\)/gi, 'site: )')
                    .replace(/filetype:\s*\)/gi, 'filetype: )');
            }

            return { text: draftText, tokenCount };
        } catch (err) {
            console.error('[Gemini Service] generateHumanizedTaskDraft failed completely:', err.message);
            return { text: 'Sistem AI sibuk. Gagal membuat draf tugas.', tokenCount: 0 };
        }
    }
}

module.exports = GeminiService;
