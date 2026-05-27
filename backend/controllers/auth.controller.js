const UserRepository = require('../repositories/user.repository');
const CourseRepository = require('../repositories/course.repository');
const TaskRepository = require('../repositories/task.repository');
const CryptoService = require('../services/crypto.service');
const MoodleScraper = require('../services/moodle.scraper');
const GeminiService = require('../services/gemini.service');
const cheerio = require('cheerio');

/**
 * Async Material Summarizer triggered in fire-and-forget background style.
 * Fetches page content dynamically, passes it through data minimization,
 * and falls back silently on any external networking/AI failures.
 */
async function triggerBackgroundSummary(materialId, url, courseName, sessionTitle, sessionCookie) {
    try {
        let contentText = `Materi dari URL: ${url}\nMata kuliah: ${courseName}`;

        // Fetch resource HTML from Moodle if authenticated session cookie is provided
        if (url.includes('/mod/resource/') && sessionCookie) {
            const axios = require('axios');
            try {
                const cleanCookie = sessionCookie.split(';')[0].trim();
                const res = await axios.get(url, {
                    headers: {
                        'Cookie': cleanCookie,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Connection': 'close'
                    },
                    timeout: 8000 // Strict 8s limit on material fetches
                });

                // Apply dynamic Data Minimization
                const sanitizedText = GeminiService.sanitizeHtml(res.data);
                if (sanitizedText && sanitizedText.trim().length > 100) {
                    contentText = sanitizedText;
                }
            } catch (fetchErr) {
                console.warn(`[AI Sync] Failed to download material HTML for extraction from ${url}:`, fetchErr.message);
            }
        }

        const summary = await GeminiService.synthesizeMaterial(contentText);
        await CourseRepository.updateMaterialSummary(materialId, summary);
        console.log(`[AI] Dynamic Pareto summary saved for material ID: ${materialId}`);
    } catch (err) {
        console.error(`[AI] Background Pareto generation failed:`, err.message);
    }
}

/**
 * POST /api/auth/sync
 * Secure crawl pipeline utilizing Isolated Repositories.
 */
async function syncHandler(req, res) {
    const { email, ut_username, ut_password } = req.body;

    if (!email || !ut_username || !ut_password) {
        return res.status(400).json({
            success: false,
            message: 'Email, username UT, dan password UT wajib diisi.'
        });
    }

    try {
        // 1. Perform scraper auth first to extract official NIM
        const scraper = new MoodleScraper();
        const authRes = await scraper.authenticate(ut_username, ut_password);

        if (!authRes.success) {
            return res.status(401).json({
                success: false,
                message: authRes.message || authRes.error || 'Gagal login ke Moodle UT.'
            });
        }

        const officialNIM = authRes.nim || ut_username;

        // 2. Cross-Check Validation (Protokol Anti-Cheating NIM-Email Strict Locking - Hybrid Auth Lock)
        const existingUser = await UserRepository.findByUtUsername(officialNIM);
        if (existingUser && existingUser.email.toLowerCase() !== email.toLowerCase()) {
            return res.status(400).json({
                success: false,
                message: `Sinkronisasi Gagal! NIM ${officialNIM} sudah terhubung dengan akun Kaizora lain. Anda tidak bisa menggunakan akun Google baru untuk mengklaim ulang fitur gratisan. Silakan login kembali menggunakan akun pertama Anda.`
            });
        }

        // 3. Encrypt credentials and upsert user safely
        const encryptedPassword = CryptoService.encrypt(ut_password);
        const user = await UserRepository.upsertUser(email, officialNIM, encryptedPassword);

        // Fetch courses list
        const moodleCourses = await scraper.getCourses();
        let totalCourses = 0;
        let totalMaterials = 0;
        let totalTasks = 0;

        for (const course of moodleCourses) {
            // Upsert Course
            const dbCourse = await CourseRepository.upsertCourse(user.id, course.utCourseId, course.name);
            totalCourses++;

            // Fetch detail
            let detail;
            try {
                detail = await scraper.getCourseDetail(course.utCourseId);
            } catch (courseErr) {
                console.warn(`[Sync] Skipping course ${course.utCourseId} detail fetch failure:`, courseErr.message);
                continue;
            }

            // Commented out destructive clear to preserve user draft answers, material summaries, and statuses
            // await CourseRepository.clearCourseActivities(dbCourse.id);

            // Sync Sessions
            const sessionIdMap = {};
            for (const s of detail.sessions) {
                const dbSession = await CourseRepository.upsertSession(dbCourse.id, s.sessionNumber, s.title);
                sessionIdMap[s.sessionNumber] = dbSession.id;
            }

             // Sync Materials
            for (const mat of detail.materials) {
                const sessionId = sessionIdMap[mat.sessionIndex];
                if (!sessionId) continue;

                const dbMaterial = await CourseRepository.upsertMaterial(
                    sessionId, 
                    mat.type, 
                    mat.title, 
                    mat.originalUrl,
                    mat.completionUrl
                );
                
                // If AI summary doesn't exist, trigger it asynchronously
                if (!dbMaterial.aiSummaryText) {
                    triggerBackgroundSummary(dbMaterial.id, mat.originalUrl, course.name, '', scraper.sessionCookie).catch(() => {});
                }
                totalMaterials++;
            }

            // Sync Tasks
            for (const tsk of detail.tasks) {
                const sessionId = sessionIdMap[tsk.sessionIndex];
                if (!sessionId) continue;

                const dbTask = await TaskRepository.upsertTask(
                    sessionId, 
                    tsk.type, 
                    tsk.title, 
                    tsk.description, 
                    tsk.deadline, 
                    tsk.status,
                    tsk.completionUrl || tsk.url
                );

                // Auto-Absensi Bypass: Visit the lesson/attendance link automatically to register attendance
                if (tsk.type === 'Absensi' && tsk.url) {
                    console.log(`[Auto-Absensi] Auto-confirming attendance by visiting: ${tsk.url}`);
                    scraper.client.get(tsk.url, {
                        headers: { 'Cookie': scraper._cookieHeader() },
                        timeout: 5000
                    }).then(() => {
                        // Automatically update status to drafted with success message
                        TaskRepository.updateTaskDraft(dbTask.id, 'Kehadiran Anda telah berhasil dikonfirmasi secara otomatis oleh Kaizora Scholar Bypass Engine!').catch(() => {});
                    }).catch(err => {
                        console.warn(`[Auto-Absensi] Failed visiting attendance link:`, err.message);
                    });
                }

                totalTasks++;
            }
        }

        return res.status(200).json({
            success: true,
            message: `Sinkronisasi berhasil! ${totalCourses} matkul, ${totalMaterials} materi, dan ${totalTasks} tugas disinkronkan.`,
            user: { 
                id: user.id, 
                email: user.email,
                packageType: user.packageType,
                tokensUsed: user.tokensUsed,
                tokensMax: user.tokensMax
            }
        });

    } catch (error) {
        console.error('[Controller] Sync error:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem saat sinkronisasi data Moodle.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * GET /api/courses
 */
async function getCoursesHandler(req, res) {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Query parameter "email" diperlukan.'
        });
    }

    try {
        const courses = await CourseRepository.getCoursesByEmail(email);
        const user = await UserRepository.findByEmail(email);
        return res.status(200).json({
            success: true,
            courses,
            user: user ? {
                packageType: user.packageType,
                tokensUsed: user.tokensUsed,
                tokensMax: user.tokensMax,
                aiTokensPurchased: user.aiTokensPurchased
            } : null
        });
    } catch (error) {
        console.error('[Controller] getCourses error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mata kuliah dari database.'
        });
    }
}

/**
 * GET /api/courses/:id/data
 */
async function getCourseDataHandler(req, res) {
    const courseId = parseInt(req.params.id);

    if (isNaN(courseId)) {
        return res.status(400).json({
            success: false,
            message: 'Course ID tidak valid.'
        });
    }

    try {
        const sessions = await CourseRepository.getCourseData(courseId);
        return res.status(200).json({
            success: true,
            sessions
        });
    } catch (error) {
        console.error('[Controller] getCourseData error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data sesi kursus dari database.'
        });
    }
}

/**
 * POST /api/ai/generate-task
 * On-demand task drafting with Gemini model integration.
 */
async function generateTaskDraftHandler(req, res) {
    const { task_id, academic_details } = req.body;

    if (!task_id) {
        return res.status(400).json({
            success: false,
            message: 'Parameter task_id diperlukan.'
        });
    }

    try {
        const contextData = await TaskRepository.getTaskWithContext(task_id);

        if (!contextData) {
            return res.status(404).json({
                success: false,
                message: 'Tugas/Diskusi tidak ditemukan.'
            });
        }

        const { task, sessionTitle, courseName, user } = contextData;

        // Check token availability (Protokol Anti-Cheating & SaaS Enforcement)
        const remainingTokens = Math.max(0, user.tokensMax - user.tokensUsed) + (user.aiTokensPurchased || 0);
        if (remainingTokens <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Batas kuota AI Anda telah habis. Silakan lakukan Top Up paket kuota untuk dapat terus menggunakan fitur AI.'
            });
        }

        // Build a highly rich and minimized session context string
        const sessionContext = `Mata Kuliah: ${courseName}\nTopik Sesi: ${sessionTitle}\nInstruksi Tambahan: ${task.description || 'Tidak ada deskripsi'}`;

        // Fetch user academic details, defaulting to form details provided by the user
        let academicDetails = {
            name: (academic_details?.name || 'Fadjar Setiawan').replace(/^\d+\s+/, '').trim(),
            nim: academic_details?.nim || user.utUsername || '054308893',
            prodi: academic_details?.prodi || 'Sistem Informasi'
        };

        if (!academic_details?.name || !academic_details?.prodi) {
            try {
                const decryptedPassword = CryptoService.decrypt(user.utPassword);
                const scraper = new MoodleScraper();
                await scraper.authenticate(user.utUsername, decryptedPassword);
                const scraperDetails = await scraper.getUserAcademicDetails();
                if (scraperDetails) {
                    academicDetails.name = academicDetails.name === 'Fadjar Setiawan' ? (scraperDetails.name || academicDetails.name) : academicDetails.name;
                    academicDetails.prodi = academicDetails.prodi === 'Sistem Informasi' ? (scraperDetails.prodi || academicDetails.prodi) : academicDetails.prodi;
                }
            } catch (scrapErr) {
                console.warn('[Controller] Failed to fetch academic details from scraper, falling back to defaults:', scrapErr.message);
            }
        }

        // Clean name (strip NIM prefix if present)
        academicDetails.name = academicDetails.name.replace(/^\d+\s+/, '').trim();

        // Parse any task attachments from description field
        let pdfAttachments = [];
        let cleanDescription = task.description || '';
        let hasAttachmentsSign = cleanDescription.includes('[Kaizora-Attachments]:');
        let attachments = [];

        // FALLBACK: If task description doesn't have [Kaizora-Attachments] and it's a Tugas/Diskusi,
        // dynamically crawl the Moodle task page on-the-fly to pull the latest instructions & attachments!
        if (!hasAttachmentsSign && task.type !== 'Absensi' && task.type !== 'Kuis' && task.url) {
            console.log(`[Controller] Task ${task.title} has no attachments in DB. Performing dynamic on-the-fly detail crawl...`);
            try {
                const decryptedPassword = CryptoService.decrypt(user.utPassword);
                const scraper = new MoodleScraper();
                const authRes = await scraper.authenticate(user.utUsername, decryptedPassword);
                
                if (authRes.success) {
                    const taskDetailRes = await scraper.authenticatedGet(task.url, { timeout: 12000 });
                    const parsedDetail = cheerio.load(taskDetailRes.data);
                    
                    // Extract description and attachments dynamically
                    let desc = null;
                    const starterPost = parsedDetail('.forumpost.starter, .forumpost.firstpost.starter, article.firstpost.starter').first();
                    if (starterPost.length > 0) {
                        desc = starterPost.find('.post-content-container, .no-overflow').first().html()?.trim() || null;
                    }
                    if (!desc) {
                        desc = parsedDetail('#intro, #assignmentintro, .box.py-3.generalbox, .no-overflow').first().html()?.trim() || null;
                    }
                    
                    const scrapedAtts = [];
                    parsedDetail('a[href*="/introattachment/"], .fileuploadsubmission a, #assign_files_tree a, a[href*="mod_assign/introattachment"]').each((_, el) => {
                        const href = parsedDetail(el).attr('href') || '';
                        const name = parsedDetail(el).text().trim();
                        if (href && name) {
                            scrapedAtts.push({ name, url: href });
                        }
                    });

                    if (desc || scrapedAtts.length > 0) {
                        let newDesc = desc || task.description || '';
                        if (scrapedAtts.length > 0) {
                            newDesc = `${newDesc}\n\n[Kaizora-Attachments]: ${JSON.stringify(scrapedAtts)}`;
                            attachments = scrapedAtts;
                            hasAttachmentsSign = true;
                        }
                        cleanDescription = desc || task.description || '';
                        
                        // Update database to persist the parsed details and attachments
                        await TaskRepository.upsertTask(
                            task.sessionId,
                            task.type,
                            task.title,
                            newDesc,
                            task.deadline,
                            task.status,
                            task.completionUrl
                        );
                        console.log(`[Controller] Dynamically updated task ${task.title} in DB with ${scrapedAtts.length} attachments.`);
                    }
                }
            } catch (crawlErr) {
                console.warn(`[Controller] Failed to perform dynamic on-the-fly detail crawl for ${task.title}:`, crawlErr.message);
            }
        }

        // Parse attachments if they exist in description
        if (hasAttachmentsSign && attachments.length === 0) {
            try {
                const parts = cleanDescription.split('[Kaizora-Attachments]:');
                cleanDescription = parts[0].trim();
                attachments = JSON.parse(parts[1].trim());
            } catch (err) {
                console.warn('[Controller] Error parsing attachments JSON from description:', err.message);
            }
        }

        if (attachments && attachments.length > 0) {
            try {
                const decryptedPassword = CryptoService.decrypt(user.utPassword);
                const scraper = new MoodleScraper();
                const authRes = await scraper.authenticate(user.utUsername, decryptedPassword);
                
                if (authRes.success) {
                    for (const att of attachments) {
                        const nameLower = att.name.toLowerCase();
                        if (nameLower.endsWith('.pdf') || att.url.toLowerCase().includes('.pdf') || nameLower.includes('pdf')) {
                            console.log(`[Controller] Automatic attachment downloading triggered for: ${att.name}`);
                            try {
                                const base64 = await scraper.downloadMoodleFileBase64(att.url);
                                pdfAttachments.push({
                                    name: att.name,
                                    base64: base64
                                });
                                console.log(`[Controller] PDF attachment successfully downloaded and prepared: ${att.name}`);
                            } catch (downErr) {
                                console.warn(`[Controller] Failed to download PDF attachment ${att.name}:`, downErr.message);
                            }
                        }
                    }
                } else {
                    console.warn('[Controller] Moodle authentication failed during attachment download:', authRes.message);
                }
            } catch (scrapErr) {
                console.warn('[Controller] Error initializing scraper for attachment download:', scrapErr.message);
            }
        }

        // Keep the task description clean of the JSON metadata for prompts
        const cleanTask = {
            ...task,
            description: cleanDescription
        };

        // ── WORKFLOW STATE MACHINE ENGINE: FASE INTEROGASI -> AKTIVASI -> EVALUASI ──
        
        // Scenario A: User requested to reset the current AI session state
        if (req.body.reset === true) {
            console.log(`[Controller] Resetting AI session state for task ${task.id} to idle.`);
            const resetTask = await TaskRepository.updateTaskAiSession(task.id, {
                aiSessionState: 'idle',
                aiContextForm: null,
                aiSocraticQuestion: null,
                aiSocraticAnswer: null,
                aiDraftAnswer: null,
                status: 'pending'
            });
            return res.status(200).json({
                success: true,
                phase: 'idle',
                message: 'Sesi interaktif AI berhasil di-reset.',
                task: {
                    id: resetTask.id,
                    status: resetTask.status,
                    aiDraftAnswer: resetTask.aiDraftAnswer,
                    aiSessionState: resetTask.aiSessionState,
                    aiContextForm: resetTask.aiContextForm,
                    aiSocraticQuestion: resetTask.aiSocraticQuestion,
                    aiSocraticAnswer: resetTask.aiSocraticAnswer
                }
            });
        }

        // Scenario B: First time request - task is idle, transition to interrogation (Form Konteks)
        if (task.aiSessionState === 'idle' && !req.body.context_form) {
            const updatedTask = await TaskRepository.updateTaskAiSession(task.id, {
                aiSessionState: 'interrogation'
            });
            return res.status(200).json({
                success: true,
                phase: 'interrogation',
                message: 'Form Konteks Mahasiswa harus diisi untuk mempersonalisasi tugas.',
                task: {
                    id: updatedTask.id,
                    status: updatedTask.status,
                    aiDraftAnswer: updatedTask.aiDraftAnswer,
                    aiSessionState: updatedTask.aiSessionState,
                    aiContextForm: updatedTask.aiContextForm,
                    aiSocraticQuestion: updatedTask.aiSocraticQuestion,
                    aiSocraticAnswer: updatedTask.aiSocraticAnswer
                }
            });
        }

        // Scenario C: User submitted the Context Form - transition from interrogation to activation (Soal Uji Nalar)
        if (req.body.context_form) {
            const contextFormObj = req.body.context_form; // { style, perspective, localExample }
            console.log(`[Controller] Processing Context Form for task ${task.id}. Generating Socratic question...`);
            
            const socraticQuestion = await GeminiService.generateSocraticQuestion(cleanTask, sessionContext, contextFormObj);
            
            const updatedTask = await TaskRepository.updateTaskAiSession(task.id, {
                aiSessionState: 'activation',
                aiContextForm: JSON.stringify(contextFormObj),
                aiSocraticQuestion: socraticQuestion
            });
            
            return res.status(200).json({
                success: true,
                phase: 'activation',
                message: 'Soal Uji Nalar berhasil dibuat.',
                socraticQuestion: socraticQuestion,
                task: {
                    id: updatedTask.id,
                    status: updatedTask.status,
                    aiDraftAnswer: updatedTask.aiDraftAnswer,
                    aiSessionState: updatedTask.aiSessionState,
                    aiContextForm: updatedTask.aiContextForm,
                    aiSocraticQuestion: updatedTask.aiSocraticQuestion,
                    aiSocraticAnswer: updatedTask.aiSocraticAnswer
                }
            });
        }

        // Scenario D: User submitted Socratic Answer - transition from activation to evaluated (Humanized Generate)
        if (req.body.socratic_answer) {
            const socraticAnswer = req.body.socratic_answer;
            const contextFormObj = JSON.parse(task.aiContextForm || '{}');
            const socraticQuestion = task.aiSocraticQuestion || 'Pertanyaan logika materi.';
            
            console.log(`[Controller] Generating final humanized output for task ${task.id} using Socratic answer...`);

            const draftResult = await GeminiService.generateHumanizedTaskDraft(
                cleanTask,
                sessionContext,
                academicDetails,
                pdfAttachments,
                contextFormObj,
                socraticQuestion,
                socraticAnswer
            );

            const draftAnswer = draftResult.text;
            const tokensToConsume = draftResult.tokenCount ?? (pdfAttachments.length > 0 ? 8500 : 4500);

            // ── CRITICAL GUARD: Do NOT deduct tokens if AI generation failed ──
            const FALLBACK_SIGNATURES = ['Sistem AI sibuk', 'Silakan muat ulang', 'gagal merespons'];
            const isFailedGeneration = !draftAnswer || tokensToConsume === 0 || 
                FALLBACK_SIGNATURES.some(sig => draftAnswer.includes(sig));

            if (isFailedGeneration) {
                console.warn(`[Controller] AI generation returned fallback/error. Tokens NOT deducted.`);
                return res.status(503).json({
                    success: false,
                    message: 'Engine AI sedang sibuk atau kuota API terlampaui. Token Anda TIDAK dipotong. Silakan coba lagi.',
                    user: {
                        tokensUsed: user.tokensUsed,
                        tokensMax: user.tokensMax,
                        aiTokensPurchased: user.aiTokensPurchased || 0,
                        packageType: user.packageType
                    }
                });
            }

            // Save draft, mark session as 'evaluated', set status to 'drafted'
            const updatedTask = await TaskRepository.updateTaskAiSession(task.id, {
                aiSessionState: 'evaluated',
                aiSocraticAnswer: socraticAnswer,
                aiDraftAnswer: draftAnswer,
                status: 'drafted'
            });

            // Deduct tokens and log in a secure database transaction block
            const sessionNumberMatch = sessionTitle.match(/Sesi\s*(\d+)/i);
            const sessionNum = sessionNumberMatch ? parseInt(sessionNumberMatch[1]) : 1;
            const activityType = task.type === 'Diskusi' ? 'DISCUSSION_DRAFT' : 'TASK_DRAFT';

            const updatedUser = await UserRepository.deductTokensWithAudit(
                user.id,
                tokensToConsume,
                activityType,
                courseName,
                sessionNum
            );

            return res.status(200).json({
                success: true,
                phase: 'evaluated',
                message: 'Draf humanized akademik berhasil dibuat!',
                task: {
                    id: updatedTask.id,
                    status: updatedTask.status,
                    aiDraftAnswer: updatedTask.aiDraftAnswer,
                    aiSessionState: updatedTask.aiSessionState,
                    aiContextForm: updatedTask.aiContextForm,
                    aiSocraticQuestion: updatedTask.aiSocraticQuestion,
                    aiSocraticAnswer: updatedTask.aiSocraticAnswer
                },
                user: {
                    tokensUsed: updatedUser.tokensUsed,
                    tokensMax: updatedUser.tokensMax,
                    aiTokensPurchased: updatedUser.aiTokensPurchased,
                    packageType: updatedUser.packageType
                }
            });
        }

        // Scenario E: Standard fallback - return active state representation
        return res.status(200).json({
            success: true,
            phase: task.aiSessionState,
            socraticQuestion: task.aiSocraticQuestion,
            task: {
                id: task.id,
                status: task.status,
                aiDraftAnswer: task.aiDraftAnswer,
                aiSessionState: task.aiSessionState,
                aiContextForm: task.aiContextForm,
                aiSocraticQuestion: task.aiSocraticQuestion,
                aiSocraticAnswer: task.aiSocraticAnswer
            }
        });

    } catch (error) {
        console.error('[Controller] generateTaskDraft error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Gagal menghasilkan draf jawaban menggunakan AI.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * POST /api/courses/:id/submit-discussion
 * Automatically post a discussion reply on behalf of the student.
 */
async function submitDiscussionHandler(req, res) {
    const courseId = parseInt(req.params.id);
    const { task_id, reply_text, email } = req.body;

    if (isNaN(courseId) || !task_id || !reply_text || !email) {
        return res.status(400).json({
            success: false,
            message: 'Course ID, task_id, reply_text, dan email wajib disediakan.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        }

        const contextData = await TaskRepository.getTaskWithContext(task_id);
        if (!contextData) {
            return res.status(404).json({ success: false, message: 'Diskusi tidak ditemukan.' });
        }
        const { task } = contextData;

        if (task.type !== 'Diskusi') {
            return res.status(400).json({ success: false, message: 'Aktivitas ini bukan bertipe Diskusi.' });
        }

        const decryptedPassword = CryptoService.decrypt(user.utPassword);
        const scraper = new MoodleScraper();
        await scraper.authenticate(user.utUsername, decryptedPassword);

        // Determine view URL from completionUrl
        let discussionUrl = task.completionUrl;
        if (discussionUrl && discussionUrl.includes('togglecompletion.php')) {
            const urlObj = new URL(discussionUrl);
            const cmid = urlObj.searchParams.get('id');
            discussionUrl = `https://elearning.ut.ac.id/mod/forum/view.php?id=${cmid}`;
        }

        if (!discussionUrl) {
            return res.status(400).json({
                success: false,
                message: 'URL Diskusi Moodle tidak dapat diidentifikasi.'
            });
        }

        console.log(`[Discussion Post] Fetching view page: ${discussionUrl}`);
        const viewRes = await scraper.authenticatedGet(discussionUrl, { timeout: 10000 });
        const $view = cheerio.load(viewRes.data);

        // Find the starter post reply link
        const replyHref = $view('.forumpost.starter a[href*="reply="], article.firstpost.starter a[href*="reply="], a[href*="/mod/forum/post.php?reply="]').first().attr('href');
        
        if (!replyHref) {
            return res.status(403).json({
                success: false,
                message: 'Gagal menemukan tombol balas ("Reply") untuk diskusi ini. Diskusi mungkin dikunci atau telah melewati batas waktu.'
            });
        }

        const fullReplyUrl = replyHref.startsWith('http') ? replyHref : `https://elearning.ut.ac.id${replyHref}`;
        console.log(`[Discussion Post] Fetching reply page: ${fullReplyUrl}`);
        const replyPageRes = await scraper.authenticatedGet(fullReplyUrl, { timeout: 10000 });

        const $replyPage = cheerio.load(replyPageRes.data);
        const form = $replyPage('form[action*="post.php"]');
        if (form.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memuat formulir balasan diskusi dari Moodle.'
            });
        }

        // Parse all hidden and visible inputs
        const payload = {};
        form.find('input[type="hidden"], input[type="text"], textarea, select').each((_, el) => {
            const name = $replyPage(el).attr('name');
            const val = $replyPage(el).attr('value') || $replyPage(el).val() || '';
            if (name) {
                payload[name] = val;
            }
        });

        // Log the keys parsed from the form to nodemon console
        const parsedKeys = Object.keys(payload);
        console.log(`[Discussion Post] Parsed form keys:`, parsedKeys);

        // Helper to render HTML table from ASCII rows
        const renderHtmlTable = (lines) => {
            if (lines.length === 0) return '';

            const parseRow = (line) => {
                let clean = line.trim();
                if (clean.startsWith('|')) clean = clean.slice(1);
                if (clean.endsWith('|')) clean = clean.slice(0, -1);
                return clean.split('|').map(cell => cell.trim());
            };

            let html = '<div class="theme-table-wrap" style="overflow-x:auto; margin: 16px 0; border: 1px solid #ddd; border-radius: 8px;"><table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #ddd; width: 100%; font-size: 13px; font-family: sans-serif;">';
            let hasHeader = false;

            if (lines.length > 1) {
                const secondRowCells = parseRow(lines[1]);
                const isSeparator = secondRowCells.every(cell => cell.match(/^:?-+:?$/));
                if (isSeparator) {
                    hasHeader = true;
                }
            }

            for (let i = 0; i < lines.length; i++) {
                if (i === 1 && hasHeader) continue; // Skip separator line

                const cells = parseRow(lines[i]);
                if (i === 0 && hasHeader) {
                    html += '<thead style="background-color: #f3f4f6; font-weight: bold; color: #111827;"><tr>';
                    for (const cell of cells) {
                        html += `<th style="border: 1px solid #ddd; padding: 10px; text-align: left;">${cell}</th>`;
                    }
                    html += '</tr></thead><tbody>';
                } else {
                    if (i === 0 && !hasHeader) {
                        html += '<tbody>';
                    }
                    html += '<tr>';
                    for (const cell of cells) {
                        html += `<td style="border: 1px solid #ddd; padding: 10px; color: #374151;">${cell}</td>`;
                    }
                    html += '</tr>';
                }
            }

            html += '</tbody></table></div>';
            return html;
        };

        // Helper to convert ASCII tables to HTML
        const convertAsciiTableToHtml = (text) => {
            if (!text) return '';
            const lines = text.split('\n');
            let inTable = false;
            let tableLines = [];
            const output = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                const isTableLine = (line.startsWith('|') && line.endsWith('|')) || (line.split('|').length > 2 && line.startsWith('|'));

                if (isTableLine) {
                    if (!inTable) {
                        inTable = true;
                        tableLines = [];
                    }
                    tableLines.push(line);
                } else {
                    if (inTable) {
                        output.push(renderHtmlTable(tableLines));
                        inTable = false;
                        tableLines = [];
                    }
                    output.push(lines[i]);
                }
            }

            if (inTable) {
                output.push(renderHtmlTable(tableLines));
            }

            return output.join('\n');
        };

        // Helper to convert plain text with newlines to clean, Moodle-compatible HTML paragraphs
        const textToHtml = (txt) => {
            if (!txt) return '';
            
            // First convert ASCII tables to HTML blocks
            const withTables = convertAsciiTableToHtml(txt);
            
            // Split by table wrappers so we don't mess them up with paragraph tag wrappers
            const blocks = withTables.split(/(<div class="theme-table-wrap"[\s\S]*?<\/div>)/g);
            
            return blocks.map(block => {
                if (block.trim().startsWith('<div class="theme-table-wrap"')) {
                    return block; // Keep raw HTML table intact
                }
                return block
                    .split(/\n{2,}/)
                    .map(p => {
                        const cleanP = p.trim().replace(/\n/g, '<br />');
                        return cleanP ? `<p>${cleanP}</p>` : '';
                    })
                    .filter(Boolean)
                    .join('');
            }).join('');
        };

        const htmlReplyText = textToHtml(reply_text);

        // Add message text ONLY to the fields that were actually parsed from the form
        if ('message[text]' in payload) payload['message[text]'] = htmlReplyText;
        if ('message_editor[text]' in payload) payload['message_editor[text]'] = htmlReplyText;
        if ('message' in payload) payload['message'] = htmlReplyText;
        if ('post' in payload) payload['post'] = htmlReplyText;

        if ('message[format]' in payload) payload['message[format]'] = '1';
        if ('message_editor[format]' in payload) payload['message_editor[format]'] = '1';
        if ('postformat' in payload) payload['postformat'] = '1';

        console.log(`[Discussion Post] Full payload to submit (HTML body length: ${htmlReplyText.length}):`, payload);
        
        // Find submit button name & value
        const submitBtn = form.find('input[type="submit"], button[type="submit"]').first();
        const submitName = submitBtn.attr('name') || 'submitbutton';
        const submitVal = submitBtn.attr('value') || 'Post to forum';
        payload[submitName] = submitVal;

                const actionUrl = form.attr('action') || 'post.php';
        let absoluteActionUrl;
        if (actionUrl.startsWith('http')) {
            absoluteActionUrl = actionUrl;
        } else if (actionUrl.startsWith('/')) {
            absoluteActionUrl = `https://elearning.ut.ac.id${actionUrl}`;
        } else {
            absoluteActionUrl = `https://elearning.ut.ac.id/mod/forum/${actionUrl}`;
        }

        console.log(`[Discussion Post] Submitting reply to: ${absoluteActionUrl}`);
        
        const postRes = await scraper.client.post(absoluteActionUrl, new URLSearchParams(payload).toString(), {
            headers: {
                'Cookie': scraper._cookieHeader(),
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': fullReplyUrl
            },
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });

        console.log(`[Discussion Post] Post complete. Response status: ${postRes.status}`);

        if (postRes.status === 200) {
            const $resPage = cheerio.load(postRes.data);
            const errorMsg = $resPage('.error, .errormsg, .alert-danger, .form-control-feedback, #notice').text().trim();
            const reRenderedForm = $resPage('form[action*="post.php"]').length > 0;
            console.log(`[Discussion Post] Re-rendered form: ${reRenderedForm}`);
            if (errorMsg) {
                console.log(`[Discussion Post Error Page Msg]: "${errorMsg}"`);
            }
            if (reRenderedForm) {
                const missingFields = [];
                $resPage('.error, .errormsg, .alert-danger, .form-control-feedback').each((_, el) => {
                    missingFields.push($resPage(el).text().trim());
                });
                console.log(`[Discussion Post Validation Errors]:`, missingFields);
                return res.status(400).json({
                    success: false,
                    message: `Moodle menolak pengiriman diskusi: ${missingFields.join(', ') || 'Formulir dikembalikan dengan kesalahan pengisian.'}`
                });
            }
        }

        // Update task status in database
        await TaskRepository.updateTaskStatusAndAnswer(task_id, 'submitted', reply_text);

        return res.status(200).json({
            success: true,
            message: 'Jawaban Anda telah berhasil dikirim ke Forum Diskusi Moodle UT! 🎉'
        });

    } catch (error) {
        console.error('[Discussion Post Error]:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kegagalan saat mengirim balasan diskusi ke Moodle UT.',
            error: error.message
        });
    }
}

/**
 * POST /api/auth/resync
 * Silent background sync using stored AES-encrypted credentials.
 */
async function resyncHandler(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email wajib disediakan untuk resync.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Profil mahasiswa tidak ditemukan.'
            });
        }

        const decryptedPassword = CryptoService.decrypt(user.utPassword);
        const scraper = new MoodleScraper();
        const authRes = await scraper.authenticate(user.utUsername, decryptedPassword);

        if (!authRes.success) {
            return res.status(401).json({
                success: false,
                message: authRes.message || authRes.error || 'Kredensial Moodle UT yang tersimpan tidak valid.'
            });
        }

        const moodleCourses = await scraper.getCourses();
        let totalCourses = 0;
        let totalMaterials = 0;
        let totalTasks = 0;

        for (const course of moodleCourses) {
            const dbCourse = await CourseRepository.upsertCourse(user.id, course.utCourseId, course.name);
            totalCourses++;

            let detail;
            try {
                detail = await scraper.getCourseDetail(course.utCourseId);
            } catch (courseErr) {
                console.warn(`[Sync] Skipping course ${course.utCourseId} detail fetch failure:`, courseErr.message);
                continue;
            }

            // Commented out destructive clear to preserve user draft answers, material summaries, and statuses
            // await CourseRepository.clearCourseActivities(dbCourse.id);

            const sessionIdMap = {};
            for (const s of detail.sessions) {
                const dbSession = await CourseRepository.upsertSession(dbCourse.id, s.sessionNumber, s.title);
                sessionIdMap[s.sessionNumber] = dbSession.id;
            }

            for (const mat of detail.materials) {
                const sessionId = sessionIdMap[mat.sessionIndex];
                if (!sessionId) continue;

                const dbMaterial = await CourseRepository.upsertMaterial(
                    sessionId, 
                    mat.type, 
                    mat.title, 
                    mat.originalUrl,
                    mat.completionUrl
                );
                
                if (!dbMaterial.aiSummaryText) {
                    triggerBackgroundSummary(dbMaterial.id, mat.originalUrl, course.name, '', scraper.sessionCookie).catch(() => {});
                }
                totalMaterials++;
            }

            for (const tsk of detail.tasks) {
                const sessionId = sessionIdMap[tsk.sessionIndex];
                if (!sessionId) continue;

                const dbTask = await TaskRepository.upsertTask(
                    sessionId, 
                    tsk.type, 
                    tsk.title, 
                    tsk.description, 
                    tsk.deadline, 
                    tsk.status,
                    tsk.completionUrl || tsk.url
                );

                if (tsk.type === 'Absensi' && tsk.url) {
                    console.log(`[Auto-Absensi] Auto-confirming attendance by submitting form: ${tsk.url}`);
                    submitResilientAttendanceForm(scraper, tsk.url).then((ok) => {
                        if (ok) {
                            TaskRepository.updateTaskDraft(dbTask.id, 'Kehadiran Anda telah berhasil dikonfirmasi secara otomatis oleh Kaizora Scholar Bypass Engine!').catch(() => {});
                        }
                    }).catch(err => {
                        console.warn(`[Auto-Absensi] Resync failed to auto-confirm presence:`, err.message);
                    });
                }
                totalTasks++;
            }
        }

        return res.status(200).json({
            success: true,
            message: `Pembaruan data berhasil! ${totalCourses} matkul, ${totalMaterials} materi, dan ${totalTasks} tugas telah disinkronkan kembali.`
        });

    } catch (error) {
        console.error('[Controller] Resync error:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kegagalan saat menyegarkan data Moodle UT.',
            error: error.message
        });
    }
}

/**
 * Resilient Moodle Attendance Form Formatter & Auto-Submitter
 */
async function submitResilientAttendanceForm(scraper, attUrl) {
    try {
        console.log(`[Auto-Absensi] Fetching attendance page: ${attUrl}`);
        const res = await scraper.authenticatedGet(attUrl, { timeout: 8000 });
        const $ = cheerio.load(res.data);

        let answerId = null;
        let answerName = 'answerid';
        const scannedOptions = [];

        // Scan radio/checkbox inputs for "Hadir" / "Present" / "Setuju"
        $('input[type="radio"], input[type="checkbox"]').each((_, inputEl) => {
            const val = $(inputEl).attr('value') || '';
            const id = $(inputEl).attr('id') || '';
            
            let labelText = '';
            
            // Priority 1: Check if inside a <label> wrapper
            const closestLabel = $(inputEl).closest('label');
            if (closestLabel.length > 0) {
                labelText = closestLabel.text().trim();
            }
            
            // Priority 2: Check label[for="id"]
            if (!labelText && id) {
                labelText = $(`label[for="${id}"]`).text().trim();
            }
            
            // Priority 3: Extract direct next sibling text node and inline elements
            if (!labelText) {
                try {
                    let directText = '';
                    let node = inputEl.nextSibling;
                    while (node) {
                        if (node.nodeType === 3) { // Text node
                            directText += node.nodeValue;
                        } else if (node.nodeType === 1) { // Element node (e.g. span, strong)
                            directText += $(node).text();
                        }
                        if (node.nodeName === 'br' || node.nodeName === 'p' || node.nodeName === 'div') {
                            break;
                        }
                        node = node.nextSibling;
                    }
                    labelText = directText.trim();
                } catch (siblingErr) {
                    console.warn('[Auto-Absensi] Sibling traversal error:', siblingErr.message);
                }
            }
            
            // Clean up any double spaces or formatting in label
            labelText = labelText.replace(/\s+/g, ' ').trim();
            
            console.log(`[Auto-Absensi] Scanned option: value="${val}", labelText="${labelText}"`);
            
            const isMatch = /hadir|present|setuju|yes|konfirmasi/i.test(val) || /hadir|present|setuju|yes|konfirmasi/i.test(labelText);
            scannedOptions.push({
                value: val,
                label: labelText || '(Tanpa Label)',
                matched: isMatch
            });

            if (isMatch) {
                console.log(`[Auto-Absensi] MATCH FOUND: value="${val}", labelText="${labelText}"`);
                answerId = val;
                answerName = $(inputEl).attr('name') || answerName;
            }
        });

        // Find submit form
        let form = $('form[action*="continue.php"], form[action*="view.php"], form[action*="attendance.php"]');
        if (form.length === 0) {
            form = $('form'); // fallback to first form on page
        }

        if (form.length > 0) {
            const action = form.attr('action') || attUrl;
            const payload = {};

            // Extract all hidden inputs
            form.find('input[type="hidden"], input[type="text"]').each((_, hiddenEl) => {
                const name = $(hiddenEl).attr('name');
                const val = $(hiddenEl).attr('value') || '';
                if (name) {
                    payload[name] = val;
                }
            });

            if (answerId) {
                payload[answerName] = answerId;
            } else {
                // If there are options but none matched, we raise an issue to prevent wrong clicks
                if (scannedOptions.length > 0) {
                    const optionsText = scannedOptions.map(o => `"${o.label}" (value: ${o.value})`).join(', ');
                    return {
                        success: false,
                        message: `Sistem menemukan pilihan [${optionsText}], tetapi tidak ada pilihan positif ('Hadir'/'Present') yang cocok. Silakan isi kehadiran secara manual untuk menghindari kesalahan absensi.`,
                        scannedOptions
                    };
                } else {
                    // Check if already completed
                    const completedText = $('body').text().toLowerCase();
                    if (completedText.includes('sudah mengisi') || completedText.includes('sudah hadir') || completedText.includes('already completed') || completedText.includes('you have completed')) {
                        return {
                            success: true,
                            message: 'Kehadiran ini sepertinya sudah diisi sebelumnya di e-learning.',
                            scannedOptions: [],
                            alreadyDone: true
                        };
                    }
                }
            }

            const absoluteAction = action.startsWith('http') ? action : `https://elearning.ut.ac.id${action}`;
            console.log(`[Auto-Absensi] Resilient submitting form to ${absoluteAction} with payload:`, payload);

            await scraper.client.post(absoluteAction, new URLSearchParams(payload).toString(), {
                headers: {
                    'Cookie': scraper._cookieHeader(),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': attUrl
                },
                timeout: 8000
            });

            const chosen = scannedOptions.find(o => o.value === answerId);
            return {
                success: true,
                message: `Berhasil melakukan bypass absensi. Memilih opsi: "${chosen ? chosen.label : 'Hadir'}"`,
                scannedOptions,
                chosenOption: chosen,
                submittedPayload: payload
            };
        } else {
            return {
                success: false,
                message: 'Tidak ditemukan form absensi pada halaman e-learning. Pastikan sesi kehadiran sudah dibuka.',
                scannedOptions
            };
        }
    } catch (err) {
        console.error(`[Auto-Absensi] Resilient submit failed for ${attUrl}:`, err.message);
        return {
            success: false,
            message: `Gagal menghubungi e-learning UT: ${err.message}`,
            scannedOptions: []
        };
    }
}

/**
 * POST /api/tasks/:id/bypass-attendance
 */
async function bypassSingleAttendanceHandler(req, res) {
    const taskId = parseInt(req.params.id);
    const { email } = req.body;

    if (isNaN(taskId) || !email) {
        return res.status(400).json({
            success: false,
            message: 'ID Absensi dan Email wajib diisi.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

        const taskContext = await TaskRepository.getTaskWithContext(taskId);
        if (!taskContext) return res.status(404).json({ success: false, message: 'Sesi absensi tidak ditemukan di database.' });

        const decryptedPassword = CryptoService.decrypt(taskContext.user.utPassword);
        const scraper = new MoodleScraper();
        await scraper.authenticate(taskContext.user.utUsername, decryptedPassword);

        // Run the resilient submit
        const result = await submitResilientAttendanceForm(scraper, taskContext.task.url);

        if (result.success) {
            // Update the task status to submitted and set the log in aiDraftAnswer
            let logMsg = result.message;
            if (result.scannedOptions && result.scannedOptions.length > 0) {
                logMsg += '\n\nOpsi yang dipindai:\n' + result.scannedOptions.map(o => `• [${o.matched ? 'X' : ' '}] ${o.label}`).join('\n');
            }
            await TaskRepository.updateTaskStatusAndAnswer(taskId, 'submitted', logMsg);

            return res.status(200).json({
                success: true,
                message: result.message,
                task: {
                    id: taskId,
                    status: 'submitted',
                    aiDraftAnswer: logMsg
                }
            });
        } else {
            return res.status(422).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('[Single Attendance Bypass Error]:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * POST /api/courses/:id/complete-all-attendance
 */
async function completeAllAttendanceHandler(req, res) {
    const courseId = parseInt(req.params.id);
    const { email } = req.body;

    if (isNaN(courseId) || !email) {
        return res.status(400).json({
            success: false,
            message: 'ID Kursus dan Email wajib diisi.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

        const decryptedPassword = CryptoService.decrypt(user.utPassword);
        const scraper = new MoodleScraper();
        await scraper.authenticate(user.utUsername, decryptedPassword);

        const sessionsData = await CourseRepository.getCourseData(courseId);
        const attendances = [];
        for (const sess of sessionsData) {
            const atts = sess.tasks.filter(t => t.type === 'Absensi' && t.url && t.status !== 'submitted');
            attendances.push(...atts);
        }

        let confirmedCount = 0;
        for (const att of attendances) {
            try {
                const res = await submitResilientAttendanceForm(scraper, att.url);
                if (res.success) {
                    let logMsg = res.message;
                    if (res.scannedOptions && res.scannedOptions.length > 0) {
                        logMsg += '\n\nOpsi yang dipindai:\n' + res.scannedOptions.map(o => `• [${o.matched ? 'X' : ' '}] ${o.label}`).join('\n');
                    }
                    await TaskRepository.updateTaskStatusAndAnswer(att.id, 'submitted', logMsg);
                    confirmedCount++;
                }
            } catch (err) {
                console.error(`[One-Click Attendance] Failed for ${att.title}:`, err.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Selesai memproses presensi otomatis. ${confirmedCount} kehadiran sesi berhasil dikonfirmasi secara aman ke e-learning.`
        });
    } catch (error) {
        console.error('[One-Click Attendance Error]:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * POST /api/courses/:id/mark-all-done
 */
async function markAllDoneHandler(req, res) {
    const courseId = parseInt(req.params.id);
    const { email } = req.body;

    if (isNaN(courseId) || !email) {
        return res.status(400).json({
            success: false,
            message: 'ID Kursus dan Email wajib diisi.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

        const decryptedPassword = CryptoService.decrypt(user.utPassword);
        const scraper = new MoodleScraper();
        await scraper.authenticate(user.utUsername, decryptedPassword);

        // Fetch course record to get utCourseId
        const course = await CourseRepository.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Mata kuliah tidak ditemukan.' });
        }

        // Quick pre-sync: get the freshest completion URLs with the active session's sesskey
        try {
            console.log(`[Mark As Done] Syncing fresh completion URLs for: ${course.utCourseId}`);
            const detail = await scraper.getCourseDetail(course.utCourseId);
            
            // Commented out destructive clear to preserve user draft answers, material summaries, and statuses
            // await CourseRepository.clearCourseActivities(course.id);
            
            const sessionIdMap = {};
            for (const s of detail.sessions) {
                const dbSession = await CourseRepository.upsertSession(course.id, s.sessionNumber, s.title);
                sessionIdMap[s.sessionNumber] = dbSession.id;
            }

            for (const mat of detail.materials) {
                const sessionId = sessionIdMap[mat.sessionIndex];
                if (!sessionId) continue;
                await CourseRepository.upsertMaterial(
                    sessionId,
                    mat.type,
                    mat.title,
                    mat.originalUrl,
                    mat.completionUrl
                );
            }

            for (const tsk of detail.tasks) {
                const sessionId = sessionIdMap[tsk.sessionIndex];
                if (!sessionId) continue;
                await TaskRepository.upsertTask(
                    sessionId,
                    tsk.type,
                    tsk.title,
                    tsk.description,
                    tsk.deadline,
                    tsk.status,
                    tsk.completionUrl || tsk.url
                );
            }
            console.log(`[Mark As Done] Pre-sync successfully updated database.`);
        } catch (syncErr) {
            console.warn(`[Mark As Done] Pre-sync failed, using existing DB state:`, syncErr.message);
        }

        // Re-fetch sessionsData to get the updated completionUrl values
        const sessionsData = await CourseRepository.getCourseData(courseId);
        
        let completedCount = 0;
        const itemsToMark = [];

        for (const sess of sessionsData) {
            for (const mat of sess.materials) {
                if (mat.completionUrl) {
                    itemsToMark.push({ type: 'material', id: mat.id, url: mat.completionUrl, title: mat.title });
                }
            }
            for (const tsk of sess.tasks) {
                if (tsk.completionUrl && tsk.status !== 'drafted') {
                    itemsToMark.push({ type: 'task', id: tsk.id, url: tsk.completionUrl, title: tsk.title });
                }
            }
        }

        console.log(`[Mark As Done] Found ${itemsToMark.length} items to complete:`, itemsToMark.map(i => i.title));

        for (const item of itemsToMark) {
            try {
                // If it is a Forum or Assignment, do not call togglecompletion.php (which causes 404),
                // instead, simply trigger a view check on their actual activity URL if we can!
                const isAutoCompletionActivity = item.url.includes('/mod/forum/') || item.url.includes('/mod/assign/');
                
                if (isAutoCompletionActivity) {
                    let targetUrl = item.url;
                    if (item.url.includes('togglecompletion.php')) {
                        const urlObj = new URL(item.url);
                        const cmid = urlObj.searchParams.get('id');
                        const modType = item.url.includes('/mod/forum/') ? 'forum' : 'assign';
                        targetUrl = `https://elearning.ut.ac.id/mod/${modType}/view.php?id=${cmid}`;
                    }
                    console.log(`[Mark As Done] Auto-completion item: Viewing ${item.title} to trigger auto-completion at ${targetUrl}`);
                    await scraper.authenticatedGet(targetUrl, { timeout: 8000 });
                } else if (item.url.includes('togglecompletion.php')) {
                    const urlObj = new URL(item.url);
                    const params = new URLSearchParams(urlObj.search);
                    // Add Moodle's native ajax=1 parameter to get a clean JSON response and prevent 302/303 redirect cycles
                    params.set('ajax', '1');

                    try {
                        await scraper.client.post('/course/togglecompletion.php', params.toString(), {
                            headers: {
                                'Cookie': scraper._cookieHeader(),
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Referer': `https://elearning.ut.ac.id/course/view.php?id=${course.utCourseId}`
                            },
                            timeout: 8000
                        });
                    } catch (postErr) {
                        console.warn(`[Mark As Done] POST failed for ${item.title}, executing GET fallback:`, postErr.message);
                        // Fallback: Trigger via GET request which Moodle natively supports if session key matches
                        await scraper.authenticatedGet(item.url, { timeout: 8000 });
                    }
                } else {
                    await scraper.authenticatedGet(item.url, { timeout: 8000 });
                }
                
                if (item.type === 'task') {
                    await TaskRepository.updateTaskDraft(item.id, 'Aktivitas ditandai selesai secara eksternal.');
                }
                completedCount++;
            } catch (err) {
                console.error(`[Mark As Done] Failed for ${item.title}:`, err.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Penyelesaian aktivitas Moodle selesai. ${completedCount} dari ${itemsToMark.length} item berhasil ditandai selesai secara eksternal.`
        });
    } catch (error) {
        console.error('[Mark All Done Error]:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * POST /api/courses/:id/submit-assignment
 * Automatically upload and submit an assignment on behalf of the student.
 */
async function submitAssignmentHandler(req, res) {
    const courseId = parseInt(req.params.id);
    const { task_id, file_base64, file_name, email } = req.body;

    if (isNaN(courseId) || !task_id || !file_base64 || !file_name || !email) {
        return res.status(400).json({
            success: false,
            message: 'Course ID, task_id, file_base64, file_name, dan email wajib disediakan.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        }

        const contextData = await TaskRepository.getTaskWithContext(task_id);
        if (!contextData) {
            return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
        }
        const { task, courseName } = contextData;

        if (task.type !== 'Tugas') {
            return res.status(400).json({ success: false, message: 'Aktivitas ini bukan bertipe Tugas.' });
        }

        const decryptedPassword = CryptoService.decrypt(user.utPassword);
        const scraper = new MoodleScraper();
        await scraper.authenticate(user.utUsername, decryptedPassword);

        // Fetch User's profile name from Moodle
        let studentFullName = await scraper.getUserFullName();
        if (!studentFullName) {
            studentFullName = "FADJAR SETIAWAN"; // fallback default
        }
        const author = `${user.utUsername} ${studentFullName}`;

        // Determine view URL from completionUrl or fallback to task.url
        let assignUrl = task.completionUrl;
        if (assignUrl && assignUrl.includes('togglecompletion.php')) {
            const urlObj = new URL(assignUrl);
            const cmid = urlObj.searchParams.get('id');
            assignUrl = `https://elearning.ut.ac.id/mod/assign/view.php?id=${cmid}`;
        } else if (!assignUrl) {
            assignUrl = task.url;
        }

        if (!assignUrl) {
            return res.status(400).json({
                success: false,
                message: 'URL Tugas Moodle tidak dapat diidentifikasi.'
            });
        }

        // Navigate to the edit submission URL directly
        const editSubmissionUrl = `${assignUrl}${assignUrl.includes('?') ? '&' : '?'}action=editsubmission`;
        console.log(`[Assignment Post] Fetching submission edit page: ${editSubmissionUrl}`);

        const editPageRes = await scraper.authenticatedGet(editSubmissionUrl, { timeout: 15000 });
        const $editPage = cheerio.load(editPageRes.data);

        // 1. Scraping variables:
        // Parse form
        const form = $editPage('form[action*="view.php"], form[id="mform1"]').first();
        if (form.length === 0) {
            const errorText = $editPage('.error, .errormsg, .alert-danger, .form-control-feedback, .submissionlocked').text().trim();
            return res.status(403).json({
                success: false,
                message: errorText || 'Gagal memuat formulir pengunggahan tugas dari Moodle. Tugas mungkin terkunci, telah dinilai, atau telah melewati batas waktu.'
            });
        }

        // Parse all hidden and visible inputs
        const payload = {};
        form.find('input[type="hidden"], input[type="text"], textarea, select').each((_, el) => {
            const name = $editPage(el).attr('name');
            const val = $editPage(el).attr('value') || $editPage(el).val() || '';
            if (name) {
                payload[name] = val;
            }
        });

        const sesskey = payload['sesskey'] || $editPage('input[name="sesskey"]').val();
        const draftItemId = payload['files_filemanager'] || $editPage('#id_files_filemanager').val() || $editPage('input[name="files_filemanager"]').val();

        if (!sesskey || !draftItemId) {
            return res.status(500).json({
                success: false,
                message: 'Gagal mengidentifikasi kunci sesi (sesskey) atau ID Draft Area Moodle.'
            });
        }

        // Dynamically discover the correct upload repository ID from Moodle's filemanager config
        let repoId = '3'; // default upload fallback (usually 3 or 5, while 4 is usually recent files)
        try {
            const htmlData = editPageRes.data;
            const regexes = [
                /\\"id\\"\s*:\s*\\"(\d+)\\"\s*,\s*\\"type\\"\s*:\s*\\"upload\\"/i,
                /\\"type\\"\s*:\s*\\"upload\\"\s*,\s*\\"id\\"\s*:\s*\\"(\d+)\\"/i,
                /\\"id\\"\s*:\s*(\d+)\s*,\s*\\"type\\"\s*:\s*\\"upload\\"/i,
                /\\"type\\"\s*:\s*\\"upload\\"\s*,\s*\\"id\\"\s*:\s*(\d+)/i,
                
                /"id"\s*:\s*"(\d+)"\s*,\s*"type"\s*:\s*"upload"/i,
                /"type"\s*:\s*"upload"\s*,\s*"id"\s*:\s*"(\d+)"/i,
                /"id"\s*:\s*(\d+)\s*,\s*"type"\s*:\s*"upload"/i,
                /"type"\s*:\s*"upload"\s*,\s*"id"\s*:\s*(\d+)/i,
                
                /'id'\s*:\s*'(\d+)'\s*,\s*'type'\s*:\s*'upload'/i,
                /'type'\s*:\s*'upload'\s*,\s*'id'\s*:\s*'(\d+)'/i,
                /'id'\s*:\s*(\d+)\s*,\s*'type'\s*:\s*'upload'/i,
                /'type'\s*:\s*'upload'\s*,\s*'id'\s*:\s*(\d+)/i
            ];

            let detectedId = null;
            for (const regex of regexes) {
                const match = htmlData.match(regex);
                if (match) {
                    detectedId = match[1];
                    break;
                }
            }

            if (!detectedId) {
                // Direct chunk search fallback
                const uploadIndex = htmlData.indexOf('"type":"upload"');
                if (uploadIndex !== -1) {
                    const chunk = htmlData.substring(Math.max(0, uploadIndex - 100), Math.min(htmlData.length, uploadIndex + 100));
                    const idMatch = chunk.match(/"id"\s*:\s*"(\d+)"/) || chunk.match(/"id"\s*:\s*(\d+)/);
                    if (idMatch) detectedId = idMatch[1];
                }
            }

            if (!detectedId) {
                // Direct escaped chunk search fallback
                const uploadIndexEscaped = htmlData.indexOf('\\"type\\":\\"upload\\"');
                if (uploadIndexEscaped !== -1) {
                    const chunk = htmlData.substring(Math.max(0, uploadIndexEscaped - 100), Math.min(htmlData.length, uploadIndexEscaped + 100));
                    const idMatch = chunk.match(/\\"id\\"\s*:\s*\\"(\d+)\\"/) || chunk.match(/\\"id\\"\s*:\s*(\d+)/);
                    if (idMatch) detectedId = idMatch[1];
                }
            }

            if (detectedId) {
                repoId = detectedId;
                console.log(`[Assignment Post] Dynamically detected upload repository ID: ${repoId}`);
            } else {
                console.warn(`[Assignment Post] Upload repository ID not found in page HTML, falling back to default: ${repoId}`);
            }
        } catch (repoErr) {
            console.error('[Assignment Post] Error parsing repository ID:', repoErr.message);
        }

        // Format saveas filename based on user request:
        // Format: "Tugas [ke berapa] - [Nama matkul] | [namaku] Fadjar Setiawan"
        const taskNumMatch = task.title.match(/tugas\s*(\d+)/i);
        const taskNum = taskNumMatch ? taskNumMatch[1] : '1';
        
        const fileExt = file_name.includes('.') ? file_name.substring(file_name.lastIndexOf('.')) : '.pdf';
        const formattedFileName = `Tugas ${taskNum} - ${courseName} | ${studentFullName}${fileExt}`;

        console.log(`[Assignment Post] Uploading file formatted as: ${formattedFileName}`);

        // Convert base64 back to binary Buffer
        const fileBuffer = Buffer.from(file_base64, 'base64');

        // Step 2: Upload binary file to Moodle draft area
        let uploadResult;
        try {
            uploadResult = await scraper.uploadFileToDraftArea(draftItemId, sesskey, fileBuffer, formattedFileName, author, repoId);
            console.log(`[Assignment Post] Upload complete response:`, uploadResult);
        } catch (uploadErr) {
            console.error(`[Assignment Post] Upload API error:`, uploadErr);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengunggah berkas ke draft area Moodle: ' + uploadErr.message
            });
        }

        if (uploadResult && (uploadResult.error || uploadResult.errorcode)) {
            return res.status(400).json({
                success: false,
                message: `Moodle menolak pengunggahan file: ${uploadResult.error || uploadResult.errorcode}`
            });
        }

        // Step 3: POST final submission form to save changes
        payload['submissionstatement'] = '1'; // Accept the submission statement checkbox
        payload['files_filemanager'] = draftItemId;

        const submitBtn = form.find('input[type="submit"], button[type="submit"]').first();
        const submitName = submitBtn.attr('name') || 'submitbutton';
        const submitVal = submitBtn.attr('value') || 'Save changes';
        payload[submitName] = submitVal;

        const actionUrl = form.attr('action') || 'view.php';
        const absoluteActionUrl = actionUrl.startsWith('http') ? actionUrl : `https://elearning.ut.ac.id/mod/assign/${actionUrl}`;

        console.log(`[Assignment Post] Saving assignment submission to: ${absoluteActionUrl}`);

        const saveRes = await scraper.client.post(absoluteActionUrl, new URLSearchParams(payload).toString(), {
            headers: {
                'Cookie': scraper._cookieHeader(),
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': editSubmissionUrl
            },
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });

        console.log(`[Assignment Post] Form save complete. Status: ${saveRes.status}`);

        if (saveRes.status === 200) {
            const $resPage = cheerio.load(saveRes.data);
            const errorMsg = $resPage('.error, .errormsg, .alert-danger, .form-control-feedback, #notice').text().trim();
            const reRenderedForm = $resPage('form[action*="view.php"], form[id="mform1"]').length > 0;
            console.log(`[Assignment Post] Re-rendered form: ${reRenderedForm}`);

            if (errorMsg) {
                console.log(`[Assignment Post Error Page Msg]: "${errorMsg}"`);
            }

            if (reRenderedForm) {
                const missingFields = [];
                $resPage('.error, .errormsg, .alert-danger, .form-control-feedback').each((_, el) => {
                    missingFields.push($resPage(el).text().trim());
                });
                return res.status(400).json({
                    success: false,
                    message: `Moodle menolak penyimpanan tugas: ${missingFields.join(', ') || 'Silakan lengkapi semua isian wajib.'}`
                });
            }
        }

        // Update task status in database
        await TaskRepository.updateTaskStatusAndAnswer(task_id, 'submitted', `Berkas diunggah: ${formattedFileName}`);

        return res.status(200).json({
            success: true,
            message: 'Tugas Anda telah berhasil diunggah dan dikirim ke Moodle UT! 🎉',
            filename: formattedFileName
        });

    } catch (error) {
        console.error('[Assignment Post Error]:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kegagalan saat mengirim tugas ke Moodle UT.',
            error: error.message
        });
    }
}

async function upgradeHandler(req, res) {
    const { email, package_type } = req.body;

    if (!email || !package_type) {
        return res.status(400).json({
            success: false,
            message: 'Email dan package_type diperlukan.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        let tokensMax = 10000;
        if (package_type === 'premium') tokensMax = 750000;
        if (package_type === 'elite') tokensMax = 2500000;

        const updatedUser = await UserRepository.updateUserTokens(user.id, undefined, tokensMax, package_type);

        return res.status(200).json({
            success: true,
            message: `Berhasil upgrade ke paket ${package_type.toUpperCase()}!`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                packageType: updatedUser.packageType,
                tokensUsed: updatedUser.tokensUsed,
                tokensMax: updatedUser.tokensMax
            }
        });
    } catch (error) {
        console.error('[Controller] upgrade error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Gagal melakukan upgrade paket.'
        });
    }
}

async function topUpHandler(req, res) {
    const { email, package_boost } = req.body;

    if (!email || !package_boost) {
        return res.status(400).json({
            success: false,
            message: 'Email dan package_boost diperlukan.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        let amount = 0;
        let packageName = '';
        if (package_boost === 'lite') {
            amount = 100000;
            packageName = 'Token Boost Lite';
        } else if (package_boost === 'medium') {
            amount = 300000;
            packageName = 'Token Boost Medium';
        } else if (package_boost === 'max') {
            amount = 600000;
            packageName = 'Token Boost Max';
        } else {
            return res.status(400).json({
                success: false,
                message: 'Paket top up tidak valid.'
            });
        }

        const updatedUser = await UserRepository.topUpTokensWithAudit(user.id, amount, packageName);

        return res.status(200).json({
            success: true,
            message: `Top Up ${packageName} Berhasil! +${amount.toLocaleString('id-ID')} Token ditambahkan ke saldo Anda.`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                packageType: updatedUser.packageType,
                tokensUsed: updatedUser.tokensUsed,
                tokensMax: updatedUser.tokensMax,
                aiTokensPurchased: updatedUser.aiTokensPurchased
            }
        });
    } catch (error) {
        console.error('[Controller] topUp error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Gagal melakukan top up token.'
        });
    }
}

async function getTokenLogsHandler(req, res) {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email diperlukan.'
        });
    }

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        const logs = await UserRepository.getTokenLogs(user.id);
        return res.status(200).json({
            success: true,
            logs
        });
    } catch (error) {
        console.error('[Controller] getTokenLogs error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil riwayat penggunaan token.'
        });
    }
}

/**
 * POST /api/auth/google-login
 * Simulated Google Auth Endpoint for Hybrid Auth Lock compatibility.
 */
async function googleLoginHandler(req, res) {
    const { email, fullName, avatarUrl } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email Google wajib disertakan.'
        });
    }

    try {
        let user = await UserRepository.findByEmail(email);

        if (!user) {
            // New Google OAuth User: Tier 'free', ut_username and ut_password initially NULL,
            // receives standard 10000 free monthly token balance.
            user = await UserRepository.upsertUser(
                email,
                undefined, // utUsername is initially NULL
                undefined, // utPassword is initially NULL
                fullName || 'Google Student',
                avatarUrl || 'https://lh3.googleusercontent.com/a/default-user',
                'google'
            );
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName || user.email.split('@')[0],
                avatarUrl: user.avatarUrl || 'https://lh3.googleusercontent.com/a/default-user',
                authProvider: user.authProvider,
                utUsername: user.utUsername,
                packageType: user.packageType,
                tokensUsed: user.tokensUsed,
                tokensMax: user.tokensMax,
                aiTokensPurchased: user.aiTokensPurchased
            }
        });
    } catch (err) {
        console.error('[Controller] googleLogin error:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal melakukan otentikasi Google.'
        });
    }
}

module.exports = {
    syncHandler,
    getCoursesHandler,
    getCourseDataHandler,
    generateTaskDraftHandler,
    submitDiscussionHandler,
    resyncHandler,
    completeAllAttendanceHandler,
    markAllDoneHandler,
    submitAssignmentHandler,
    upgradeHandler,
    topUpHandler,
    getTokenLogsHandler,
    googleLoginHandler,
    bypassSingleAttendanceHandler
};
