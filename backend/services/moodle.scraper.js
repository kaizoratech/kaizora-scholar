const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://elearning.ut.ac.id';

/**
 * Pure parsing functions defined at module level.
 * This completely isolates DOM processing, preventing high-level closure traps
 * that could retain large V8 heap objects (CWE-400 / Memory Leak Mitigation).
 */
function parseLoginToken(html) {
    let $ = cheerio.load(html);
    const token = $('input[name="logintoken"]').val() || null;
    $ = null; // Immediate nulling to free cheerio instance memory
    return token;
}

function parseCourseLinks(html) {
    let $ = cheerio.load(html);
    const list = [];
    
    $('a[href*="/course/view.php?id="]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const nameText = $(el).text().trim();
        if (href && nameText) {
            list.push({ href, nameText });
        }
    });

    $ = null; // Free memory
    return list;
}

function parseTaskDetailPage(html) {
    let $ = cheerio.load(html);
    
    // Extract instructions / description text
    let description = null;
    const starterPost = $('.forumpost.starter, .forumpost.firstpost.starter, article.firstpost.starter').first();
    if (starterPost.length > 0) {
        description = starterPost.find('.post-content-container, .no-overflow').first().html()?.trim() || null;
    }
    
    if (!description) {
        description = $('#intro, #assignmentintro, .box.py-3.generalbox, .no-overflow').first().html()?.trim() || null;
    }
    
    // Extract due date / deadline from Moodle tables
    let deadlineText = null;
    $('table.generaltable tr, .submissionstatustable tr').each((_, tr) => {
        const header = $(tr).find('td, th').first().text().trim();
        const value = $(tr).find('td, th').last().text().trim();
        if (/due date|batas waktu/i.test(header)) {
            deadlineText = value;
        }
    });

    // Extract attachments (PDFs, docs, etc.)
    const attachments = [];
    $('a[href*="/introattachment/"], .fileuploadsubmission a, #assign_files_tree a, a[href*="mod_assign/introattachment"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const name = $(el).text().trim();
        if (href && name) {
            attachments.push({ name, url: href });
        }
    });
    
    $ = null;
    return { description, deadlineText, attachments };
}

function parseMoodleDate(dateStr) {
    if (!dateStr) return null;
    try {
        const indMonths = {
            'januari': 'january', 'februari': 'february', 'maret': 'march', 'april': 'april',
            'mei': 'may', 'juni': 'june', 'juli': 'july', 'agustus': 'august',
            'september': 'september', 'oktober': 'october', 'november': 'november', 'desember': 'december',
            'senin': '', 'selasa': '', 'rabu': '', 'kamis': '', 'jumat': '', 'sabtu': '', 'minggu': '',
            'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': '', 'saturday': '', 'sunday': ''
        };
        let cleaned = dateStr.toLowerCase().replace(/,/g, ' ');
        for (const [ind, eng] of Object.entries(indMonths)) {
            cleaned = cleaned.replace(new RegExp(`\\b${ind}\\b`, 'g'), eng);
        }
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        const parsed = Date.parse(cleaned);
        if (!isNaN(parsed)) {
            return new Date(parsed);
        }
    } catch (e) {
        console.warn('[Scraper] Failed parsing Moodle date:', dateStr, e.message);
    }
    return null;
}

function extractCompletionUrl($, aEl, sesskey) {
    const href = $(aEl).attr('href') || '';
    const matchId = href.match(/[?&]id=(\d+)/);
    if (!matchId) return null;
    
    const cmid = matchId[1];
    
    // Target parent wrapper to limit search scope (prevent searching cross-activity content)
    const activityWrapper = $(aEl).closest('li.activity, .activity, .content-item, .course-section, tr');
    
    // 1. Search for a specific button matching this cmid (modern Moodle)
    let compButton = null;
    if (activityWrapper.length > 0) {
        compButton = activityWrapper.find(`button[data-cmid="${cmid}"], [data-cmid="${cmid}"]`);
    }
    if (!compButton || compButton.length === 0) {
        // Global search fallback for the specific button
        compButton = $(`button[data-cmid="${cmid}"], [data-cmid="${cmid}"]`);
    }
    if (compButton && compButton.length > 0) {
        const state = compButton.attr('data-completionstate') || '1';
        const sk = compButton.attr('data-sesskey') || sesskey;
        return `https://elearning.ut.ac.id/course/togglecompletion.php?id=${cmid}&completionstate=${state}${sk ? `&sesskey=${sk}` : ''}`;
    }

    // 2. Search for a specific form matching this cmid (standard Moodle form)
    let compForm = null;
    if (activityWrapper.length > 0) {
        compForm = activityWrapper.find(`form[action*="togglecompletion.php"]`).filter((_, formEl) => {
            return $(formEl).find(`input[name="id"][value="${cmid}"]`).length > 0;
        });
    }
    if (!compForm || compForm.length === 0) {
        // Global search fallback for the specific form
        compForm = $(`form[action*="togglecompletion.php"]`).filter((_, formEl) => {
            return $(formEl).find(`input[name="id"][value="${cmid}"]`).length > 0;
        });
    }
    if (compForm && compForm.length > 0) {
        const action = compForm.attr('action') || '';
        const state = compForm.find('input[name="completionstate"]').val() || '1';
        const sk = compForm.find('input[name="sesskey"]').val() || sesskey;
        const absoluteAction = action.startsWith('http') ? action : `https://elearning.ut.ac.id${action}`;
        return `${absoluteAction}?id=${cmid}&completionstate=${state}${sk ? `&sesskey=${sk}` : ''}`;
    }

    // 3. Search for a specific anchor link matching this cmid (legacy Moodle link)
    let compAnchor = null;
    if (activityWrapper.length > 0) {
        compAnchor = activityWrapper.find(`a[href*="togglecompletion.php"][href*="id=${cmid}"]`);
    }
    if (!compAnchor || compAnchor.length === 0) {
        // Global search fallback for the specific anchor
        compAnchor = $(`a[href*="togglecompletion.php"][href*="id=${cmid}"]`);
    }
    if (compAnchor && compAnchor.length > 0) {
        let aHref = compAnchor.attr('href') || '';
        if (aHref && sesskey && !aHref.includes('sesskey=')) {
            aHref += (aHref.includes('?') ? '&' : '?') + `sesskey=${sesskey}`;
        }
        return aHref;
    }

    // 4. General Fallback: If the activity has manual completion indicator text in its wrapper, construct standard URL
    if (activityWrapper.length > 0) {
        const isForumOrAssign = href.includes('/mod/forum/') || href.includes('/mod/assign/');
        if (!isForumOrAssign) {
            const hasCompletionUI = activityWrapper.text().toLowerCase().includes('done') || 
                                   activityWrapper.text().toLowerCase().includes('selesai') ||
                                   activityWrapper.find('[class*="completion"], [id*="completion"]').length > 0;
            if (hasCompletionUI) {
                return `https://elearning.ut.ac.id/course/togglecompletion.php?id=${cmid}&completionstate=1&sesskey=${sesskey}`;
            }
        }
    }

    return null;
}

function isActivityCompleted($, aEl) {
    const activityWrapper = $(aEl).closest('li.activity, .activity, .content-item, .course-section, tr');
    if (activityWrapper.length === 0) return false;

    const wrapperText = activityWrapper.text().toLowerCase();

    // 1. Check for manual/automatic completion indicator text
    // Handles text like: "Done: Make forum posts: 1", "Selesai: Balas forum", "Done", "Selesai"
    if (wrapperText.includes('done:') || wrapperText.includes('selesai:')) {
        return true;
    }

    // 2. Check for manual completion button state:
    // When completed, data-completionstate is '0'
    const cmidMatch = ($(aEl).attr('href') || '').match(/[?&]id=(\d+)/);
    if (cmidMatch) {
        const cmid = cmidMatch[1];
        const compButton = activityWrapper.find(`button[data-cmid="${cmid}"], [data-cmid="${cmid}"]`);
        if (compButton.length > 0) {
            const state = compButton.attr('data-completionstate');
            if (state === '0') {
                return true;
            }
        }
    }

    // 3. Check for modern Moodle completion badges or icons
    if (activityWrapper.find('.completion-manual-y, .completed, .state-success, .state-complete, .badge-success').length > 0) {
        return true;
    }

    // 4. Check for checkmark icons or finished titles
    const checkIcon = activityWrapper.find('i.fa-check, i.fa-check-circle, .icon[title*="Done"], .icon[title*="Selesai"]');
    if (checkIcon.length > 0) {
        return true;
    }

    // 5. In case of manual checkboxes (Moodle 3.x), if the checkbox image source is "i/completion-auto-y" or "i/completion-manual-y"
    const checkboxImg = activityWrapper.find('img[src*="completion-auto-y"], img[src*="completion-manual-y"]');
    if (checkboxImg.length > 0) {
        return true;
    }

    return false;
}

function parseCourseDetailData(html, forcedSectionNum = null) {
    let sesskey = null;
    try {
        // Try regex patterns to extract session key
        let match = html.match(/"sesskey"\s*:\s*"([^"]+)"/);
        if (match) sesskey = match[1];
        if (!sesskey) {
            match = html.match(/sesskey=([^"&'\s]+)/);
            if (match) sesskey = match[1];
        }
    } catch (e) {
        console.warn('[Scraper] Failed extracting sesskey:', e.message);
    }

    let $ = cheerio.load(html);
    
    // If sesskey was not found via regex, try cheerio
    if (!sesskey) {
        sesskey = $('input[name="sesskey"]').val() || null;
    }

    console.log('[Scraper] Extracted Course Page sesskey:', sesskey);

    const sessions = [];
    const materials = [];
    const tasks = [];

    // Strategy 1: Parse from main content sections
    let sectionsFound = false;
    $('.section.main, li.section, [data-sectionid], .course-section, .content-item').each((idx, sectionEl) => {
        sectionsFound = true;
        const sectionIdAttr = $(sectionEl).attr('id') || $(sectionEl).attr('data-sectionid') || '';
        const matchNum = sectionIdAttr.match(/section-(\d+)/);
        let sectionNum = matchNum ? parseInt(matchNum[1]) : idx;
        
        // If we are forcing a section and this container is not section 0, override it
        if (forcedSectionNum !== null && sectionNum !== 0) {
            sectionNum = forcedSectionNum;
        }
        
        const titleEl = $(sectionEl).find('.sectionname, .section-title, h3.section-title, h3, h4');
        let sectionTitle = titleEl.text().trim();
        
        sectionTitle = sectionTitle.replace(/Bypass Kehadiran|Selesai|Mark as done/gi, '').replace(/\s+/g, ' ').trim();
        if (!sectionTitle) {
            sectionTitle = sectionNum === 0 ? 'Pendahuluan' : `Sesi ${sectionNum}`;
        }

        sessions.push({
            sessionNumber: sectionNum,
            title: sectionTitle
        });

        // Search for all anchors
        $(sectionEl).find('a').each((_, aEl) => {
            const href = $(aEl).attr('href') || '';
            const title = $(aEl).text().replace(/Mark as done|Selesai/gi, '').replace(/\s+/g, ' ').trim();
            if (!href || !title || href.startsWith('#')) return;

            const completionUrl = extractCompletionUrl($, aEl, sesskey);
            const completed = isActivityCompleted($, aEl);

            if (href.includes('/mod/resource/') || href.includes('/mod/url/') || href.includes('/mod/page/') || href.includes('/mod/folder/') || href.includes('/mod/book/') || href.toLowerCase().match(/\.(pdf|ppt|pptx|doc|docx)/)) {
                materials.push({
                    sessionIndex: sectionNum,
                    title: title,
                    originalUrl: href,
                    completionUrl,
                    completed
                });
            } else if (href.includes('/mod/assign/') || href.includes('/mod/forum/') || href.includes('/mod/quiz/') || href.includes('/mod/lesson/') || href.includes('/mod/attendance/')) {
                let type = 'Tugas';
                if (href.includes('/mod/forum/')) type = 'Diskusi';
                else if (href.includes('/mod/quiz/')) type = 'Kuis';
                else if (href.includes('/mod/lesson/') || href.includes('/mod/attendance/') || /kehadiran|absensi|presensi/i.test(title)) type = 'Absensi';

                tasks.push({
                    sessionIndex: sectionNum,
                    title: title,
                    url: href,
                    type: type,
                    completionUrl,
                    completed
                });
            }
        });
    });

    // Strategy 2: If no sections were found (single-section focus or page template variations), 
    // fallback to looking at any list or elements containing activity links!
    if (!sectionsFound || sessions.length === 0) {
        // Fallback session (e.g. Sesi 1)
        let sectionNum = forcedSectionNum !== null ? forcedSectionNum : 1;
        // Let's check breadcrumbs or page header for section indicator
        const pageHeader = $('.page-header-headings h1, .breadcrumb-item.active').text().trim();
        const sectionMatch = pageHeader.match(/sesi\s*(\d+)/i) || pageHeader.match(/session\s*(\d+)/i);
        if (sectionMatch) {
            sectionNum = parseInt(sectionMatch[1]);
        }
        
        sessions.push({
            sessionNumber: sectionNum,
            title: pageHeader || `Sesi ${sectionNum}`
        });

        $('a').each((_, aEl) => {
            const href = $(aEl).attr('href') || '';
            const title = $(aEl).text().replace(/Mark as done|Selesai/gi, '').replace(/\s+/g, ' ').trim();
            if (!href || !title || href.startsWith('#')) return;

            const completionUrl = extractCompletionUrl($, aEl, sesskey);
            const completed = isActivityCompleted($, aEl);

            if (href.includes('/mod/resource/') || href.includes('/mod/url/') || href.includes('/mod/page/') || href.includes('/mod/folder/') || href.includes('/mod/book/') || href.toLowerCase().match(/\.(pdf|ppt|pptx|doc|docx)/)) {
                materials.push({
                    sessionIndex: sectionNum,
                    title: title,
                    originalUrl: href,
                    completionUrl,
                    completed
                });
            } else if (href.includes('/mod/assign/') || href.includes('/mod/forum/') || href.includes('/mod/quiz/') || href.includes('/mod/lesson/') || href.includes('/mod/attendance/')) {
                let type = 'Tugas';
                if (href.includes('/mod/forum/')) type = 'Diskusi';
                else if (href.includes('/mod/quiz/')) type = 'Kuis';
                else if (href.includes('/mod/lesson/') || href.includes('/mod/attendance/') || /kehadiran|absensi|presensi/i.test(title)) type = 'Absensi';

                tasks.push({
                    sessionIndex: sectionNum,
                    title: title,
                    url: href,
                    type: type,
                    completionUrl,
                    completed
                });
            }
        });
    }

    // Strategy 3: Parse from the sidebar navigation menu if available to enrich sessions and links!
    const navBlock = $('.block_navigation, #inst4, .block-navigation');
    if (navBlock.length > 0) {
        // Look for lists under the enrolled course
        navBlock.find('li.type_structure, li.type_section').each((_, liEl) => {
            const titleEl = $(liEl).find('a, span').first();
            const text = titleEl.text().trim();
            const match = text.match(/(sesi|session|tahap)\s*(\d+)/i);
            if (match) {
                const sectionNum = parseInt(match[2]);
                // Check if session already added, if not add it!
                if (!sessions.some(s => s.sessionNumber === sectionNum)) {
                    sessions.push({
                        sessionNumber: sectionNum,
                        title: text
                    });
                }

                // Parse nested links under this session list node
                $(liEl).find('ul li a').each((_, subLink) => {
                    const subHref = $(subLink).attr('href') || '';
                    const subTitle = $(subLink).text().trim();
                    if (!subHref || !subTitle) return;

                    if (subHref.includes('/mod/resource/') || subHref.includes('/mod/url/')) {
                        // Avoid duplicates by checking originalUrl
                        if (!materials.some(m => m.originalUrl === subHref)) {
                            materials.push({
                                sessionIndex: sectionNum,
                                title: subTitle,
                                originalUrl: subHref
                            });
                        }
                    } else if (subHref.includes('/mod/assign/') || subHref.includes('/mod/forum/') || subHref.includes('/mod/quiz/') || subHref.includes('/mod/lesson/') || subHref.includes('/mod/attendance/')) {
                        if (!tasks.some(t => t.url === subHref)) {
                            let type = 'Tugas';
                            if (subHref.includes('/mod/forum/')) type = 'Diskusi';
                            else if (subHref.includes('/mod/quiz/')) type = 'Kuis';
                            else if (subHref.includes('/mod/lesson/') || subHref.includes('/mod/attendance/') || /kehadiran|absensi|presensi/i.test(subTitle)) type = 'Absensi';

                            tasks.push({
                                sessionIndex: sectionNum,
                                title: subTitle,
                                url: subHref,
                                type: type
                            });
                        }
                    }
                });
            }
        });
    }

    // De-duplicate materials and tasks by URL to guarantee perfect cleanliness
    const uniqueMaterials = [];
    const seenMatUrls = new Set();
    for (const m of materials) {
        if (!seenMatUrls.has(m.originalUrl)) {
            seenMatUrls.add(m.originalUrl);
            uniqueMaterials.push(m);
        }
    }

    const uniqueTasks = [];
    const seenTaskUrls = new Set();
    for (const t of tasks) {
        if (!seenTaskUrls.has(t.url)) {
            seenTaskUrls.add(t.url);
            uniqueTasks.push(t);
        }
    }

    // Sort sessions in ascending order
    sessions.sort((a, b) => a.sessionNumber - b.sessionNumber);

    $ = null;
    return { sessions, materials: uniqueMaterials, tasks: uniqueTasks };
}


class MoodleScraper {
    constructor() {
        this.sessionCookie = null;
        
        // Strict axios config: absolute timeout, limit response sizes, close connections
        this.client = axios.create({
            baseURL: BASE_URL,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Connection': 'close', // Explicitly close sockets to prevent unclosed streams leaks
            },
            timeout: 15000, // Absolute timeout of 15 seconds
            maxContentLength: 10 * 1024 * 1024, // 10MB safety ceiling
        });
    }

    _extractSessionCookie(rawCookies = []) {
        return rawCookies.find(c => c.startsWith('MoodleSession')) || null;
    }

    _cookieHeader() {
        if (!this.sessionCookie) return '';
        return this.sessionCookie.split(';')[0].trim();
    }

    /**
     * Resilient HTTP GET wrapper that manually follows 302/303 redirects 
     * while strictly maintaining the authenticated Cookie header.
     * Bypasses the default Axios behavior which silently strips Cookie headers upon redirects.
     */
    async authenticatedGet(url, options = {}) {
        let currentUrl = url;
        let attempts = 0;
        const maxRedirects = 5;

        while (attempts < maxRedirects) {
            const reqHeaders = {
                ...(options.headers || {}),
                'Cookie': this._cookieHeader()
            };

            const res = await this.client.get(currentUrl, {
                ...options,
                headers: reqHeaders,
                maxRedirects: 0,
                validateStatus: (status) => status >= 200 && status < 400
            });

            const newCookies = res.headers['set-cookie'] || [];
            const authCookie = this._extractSessionCookie(newCookies);
            if (authCookie) {
                this.sessionCookie = authCookie;
            }

            if (res.status === 302 || res.status === 303) {
                const redirectUrl = res.headers['location'];
                if (!redirectUrl) return res;

                currentUrl = redirectUrl.startsWith('http') 
                    ? redirectUrl.replace(BASE_URL, '') 
                    : redirectUrl;
                attempts++;
            } else {
                return res;
            }
        }
        throw new Error('Too many redirects inside authenticatedGet');
    }

    /**
     * Authenticate session using two-step HTTP flow.
     */
    async authenticate(username, password) {
        try {
            // STEP 1: GET Login CSRF Token
            const getRes = await this.client.get('/login/index.php');
            const rawCookies = getRes.headers['set-cookie'] || [];
            this.sessionCookie = this._extractSessionCookie(rawCookies);

            if (!this.sessionCookie) {
                throw new Error('MoodleSession cookie tidak ditemukan pada login page');
            }

            const loginToken = parseLoginToken(getRes.data);
            if (!loginToken) {
                throw new Error('CSRF logintoken tidak ditemukan di DOM');
            }

            // STEP 2: POST credentials
            const payload = new URLSearchParams({
                username,
                password,
                logintoken: loginToken,
                anchor: ''
            });

            const postRes = await this.client.post('/login/index.php', payload.toString(), {
                headers: {
                    'Cookie': this._cookieHeader(),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': `${BASE_URL}/login/index.php`
                },
                maxRedirects: 0,
                validateStatus: (status) => status >= 200 && status < 400
            });

            const newCookies = postRes.headers['set-cookie'] || [];
            const authCookie = this._extractSessionCookie(newCookies);
            if (authCookie) {
                this.sessionCookie = authCookie;
            }

            // ACTIVE VERIFICATION: Directly test if the session cookie has access to the /my/ dashboard page.
            // This is 100% bulletproof and bypasses any complex redirect/path configuration changes on Moodle UT.
            try {
                const verifyRes = await this.client.get('/my/', {
                    headers: { 'Cookie': this._cookieHeader() },
                    timeout: 6000
                });
                
                const $verify = cheerio.load(verifyRes.data);
                const hasLoginForm = $verify('input[name="username"]').length > 0 || $verify('input[name="logintoken"]').length > 0;
                const hasDashboardIndicator = $verify('a[href*="/course/view.php?id="], .profilepicture, a[href*="/login/logout.php"], .block_navigation').length > 0;
                
                if (!hasLoginForm && hasDashboardIndicator) {
                    console.log('[Scraper] Auth verification successful. Logged in.');
                    
                    // Extract NIM and Name from the DOM!
                    let nim = null;
                    let fullName = null;
                    
                    // Search inside .usertext first
                    const userText = $verify('.usertext, .userbutton, .usermenu, .logininfo').text().trim();
                    const nimMatch = userText.match(/\b(0\d{8})\b/);
                    if (nimMatch) {
                        nim = nimMatch[1];
                    }
                    
                    // Fallback to searching entire page HTML for a 9-digit number starting with 0
                    if (!nim) {
                        const pageText = $verify('body').text();
                        const fallbackMatch = pageText.match(/\b(0\d{8})\b/);
                        if (fallbackMatch) {
                            nim = fallbackMatch[1];
                        }
                    }

                    // Also search in img userpicture alt tag
                    if (!nim) {
                        $verify('img.userpicture, .profilepicture img').each((_, img) => {
                            const alt = $verify(img).attr('alt') || '';
                            const altMatch = alt.match(/\b(0\d{8})\b/);
                            if (altMatch) {
                                nim = altMatch[1];
                            }
                        });
                    }

                    // Extract Full Name from the text around NIM
                    if (nim) {
                        const nameRegex = new RegExp(`\\b${nim}\\b\\s*([A-Za-z\\s]+)`, 'i');
                        const nameMatch = userText.match(nameRegex) || $verify('body').text().match(nameRegex);
                        if (nameMatch) {
                            fullName = nameMatch[1].trim();
                        }
                    }

                    // If still no nim, fallback to using the username input itself if it is a 9-digit number
                    if (!nim && /^\b(0\d{8})\b$/.test(username)) {
                        nim = username;
                    }

                    return { 
                        success: true, 
                        message: 'Authentication established',
                        nim: nim || username,
                        fullName: fullName || 'Mahasiswa UT'
                    };
                }
            } catch (verifyErr) {
                console.warn('[Scraper] Auth active verification failed, trying fallback check:', verifyErr.message);
            }

            // Fallback: Check header location if active verification is inconclusive
            const location = postRes.headers['location'] || '';
            if (postRes.status === 303 && (location.includes('/my') || location === `${BASE_URL}/` || location === '/')) {
                return { success: true, message: 'Authentication established', nim: username, fullName: 'Mahasiswa UT' };
            }

            if (location.includes('/login') || location.includes('errorcode=')) {
                return { success: false, message: 'Kredensial tidak valid. Periksa kembali NIM/Password Anda.' };
            }

            return { success: false, message: 'Respon otentikasi Moodle tidak valid atau akun memerlukan SSO O365-UT.' };
        } catch (error) {
            console.error('[Scraper] Auth error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get user enrolled courses.
     */
    async getCourses() {
        if (!this.sessionCookie) throw new Error('Unauthenticated scraper execution.');

        try {
            const res = await this.client.get('/my/', {
                headers: { 'Cookie': this._cookieHeader() }
            });

            const links = parseCourseLinks(res.data);
            const courses = [];
            const seen = new Set();

            for (const item of links) {
                const match = item.href.match(/id=(\d+)/);
                if (!match) continue;

                const utCourseId = match[1];
                if (seen.has(utCourseId)) continue;
                seen.add(utCourseId);

                courses.push({
                    utCourseId,
                    name: item.nameText,
                    url: item.href.startsWith('http') ? item.href : `${BASE_URL}${item.href}`
                });
            }

            return courses;
        } catch (error) {
            console.error('[Scraper] getCourses error:', error.message);
            throw error;
        }
    }

    /**
     * Scrape detailed course sessions, materials, and tasks.
     */
    async getCourseDetail(courseId) {
        if (!this.sessionCookie) throw new Error('Unauthenticated scraper execution.');

        try {
            // Step 1: Request main page to discover section tabs
            const res = await this.authenticatedGet(`/course/view.php?id=${courseId}`);

            const sectionNumbers = new Set();
            const $ = cheerio.load(res.data);
            $('a').each((_, aEl) => {
                const href = $(aEl).attr('href') || '';
                const match = href.match(/[?&]section=(\d+)/);
                if (match) {
                    sectionNumbers.add(parseInt(match[1]));
                }
            });

            const sectionsToFetch = Array.from(sectionNumbers).sort((a, b) => a - b);
            if (sectionsToFetch.length === 0) {
                sectionsToFetch.push(0, 1, 2, 3, 4, 5, 6, 7, 8);
            } else {
                if (!sectionsToFetch.includes(0)) {
                    sectionsToFetch.unshift(0);
                }
            }

            const allSessions = [];
            const allMaterials = [];
            const allTasks = [];

            const addedSessionIndices = new Set();
            const addedMaterialUrls = new Set();
            const addedTaskUrls = new Set();

            // Step 2: Fetch each section in parallel to aggregate activities
            console.log(`[Scraper] Parallel crawl: Course ${courseId} Sections: ${sectionsToFetch.join(', ')}`);
            const sectionPromises = sectionsToFetch.map(async (secNum) => {
                try {
                    const secRes = await this.authenticatedGet(`/course/view.php?id=${courseId}&section=${secNum}`, { timeout: 10000 });
                    return { secNum, data: secRes.data };
                } catch (secErr) {
                    console.warn(`[Scraper] Failed to crawl section tab ${secNum}:`, secErr.message);
                    return { secNum, data: null };
                }
            });

            const sectionResults = await Promise.all(sectionPromises);

            for (const result of sectionResults) {
                if (!result.data) continue;
                const { sessions, materials, tasks } = parseCourseDetailData(result.data, result.secNum);

                for (const sess of sessions) {
                    if (!addedSessionIndices.has(sess.sessionNumber)) {
                        addedSessionIndices.add(sess.sessionNumber);
                        allSessions.push(sess);
                    }
                }

                for (const mat of materials) {
                    if (!addedMaterialUrls.has(mat.originalUrl)) {
                        addedMaterialUrls.add(mat.originalUrl);
                        allMaterials.push(mat);
                    }
                }

                for (const tsk of tasks) {
                    if (!addedTaskUrls.has(tsk.url)) {
                        addedTaskUrls.add(tsk.url);
                        allTasks.push(tsk);
                    }
                }
            }

            // Clean URLs and formats, and deep-resolve real links in parallel
            console.log(`[Scraper] Deep-resolving direct URLs for ${allMaterials.length} materials...`);
            const cleanMaterials = await Promise.all(allMaterials.map(async (mat) => {
                const ext = mat.originalUrl.toLowerCase();
                const type = ext.includes('.pdf') || ext.includes('resource') ? 'PDF' : ext.includes('.ppt') || ext.includes('.pptx') ? 'PDF' : 'Link';
                const baseFullUrl = mat.originalUrl.startsWith('http') ? mat.originalUrl : `${BASE_URL}${mat.originalUrl}`;
                
                // Deep resolve to find the actual PDF/Video/External link
                const resolvedUrl = await this.resolveRealResourceUrl(baseFullUrl);

                return {
                    sessionIndex: mat.sessionIndex,
                    type,
                    title: mat.title,
                    originalUrl: resolvedUrl,
                    completionUrl: mat.completionUrl
                };
            }));

            // Perform dynamic detail crawls in parallel for Tasks to grab instruction descriptions and deadlines
            const taskPromises = allTasks.map(async (tsk) => {
                let description = null;
                let deadline = null;
                const fullUrl = tsk.url.startsWith('http') ? tsk.url : `${BASE_URL}${tsk.url}`;

                if (tsk.type !== 'Kuis' && tsk.type !== 'Absensi') {
                    try {
                        const taskDetailRes = await this.authenticatedGet(fullUrl, { timeout: 8000 });
                        const parsedDetail = parseTaskDetailPage(taskDetailRes.data);
                        description = parsedDetail.description;
                        if (parsedDetail.attachments && parsedDetail.attachments.length > 0) {
                            description = `${description || ''}\n\n[Kaizora-Attachments]: ${JSON.stringify(parsedDetail.attachments)}`;
                        }
                        deadline = parseMoodleDate(parsedDetail.deadlineText);
                    } catch (taskErr) {
                        console.warn(`[Scraper] Skipped detailed fetch for ${tsk.title}:`, taskErr.message);
                    }
                }

                return {
                    sessionIndex: tsk.sessionIndex,
                    type: tsk.type,
                    title: tsk.title,
                    url: fullUrl,
                    description,
                    deadline,
                    status: tsk.completed ? 'submitted' : 'pending',
                    completionUrl: tsk.completionUrl
                };
            });

            const cleanTasks = await Promise.all(taskPromises);

            return {
                sessions: allSessions,
                materials: cleanMaterials,
                tasks: cleanTasks
            };
        } catch (error) {
            console.error('[Scraper] getCourseDetail error:', error.message);
            throw error;
        }
    }

    /**
     * Parse student's full name from Moodle top navbar
     */
    async getUserFullName() {
        try {
            const res = await this.client.get('/my/', {
                headers: { 'Cookie': this._cookieHeader() }
            });
            const $ = cheerio.load(res.data);
            let name = $('.userbutton .usertext, .usermenu .usertext, .username, .usertext, [id^="user-menu-toggle"]').first().text().trim();
            if (!name) {
                name = $('.userpicture').first().attr('alt') || '';
            }
            name = name.replace(/\s+/g, ' ').trim();
            return name || null;
        } catch (e) {
            console.warn('[Scraper] Failed to fetch user full name:', e.message);
            return null;
        }
    }

    /**
     * Fetch user's profile page and parse name, NIM, and prodi (department)
     */
    async getUserAcademicDetails() {
        try {
            const res = await this.client.get('/user/profile.php', {
                headers: { 'Cookie': this._cookieHeader() }
            });
            const $ = cheerio.load(res.data);
            
            // Name
            let name = $('.userbutton .usertext, .usermenu .usertext, .username, .usertext, [id^="user-menu-toggle"]').first().text().trim();
            if (!name) {
                name = $('.userpicture').first().attr('alt') || '';
            }
            name = name.replace(/\s+/g, ' ').trim();

            // Department / Prodi
            let prodi = '';
            $('li, dt, dd, td, span').each((_, el) => {
                const text = $(el).text().trim();
                if (text.toLowerCase().includes('departemen') || text.toLowerCase().includes('program studi') || text.toLowerCase().includes('prodi') || text.toLowerCase().includes('jurusan')) {
                    const cleanText = text.replace(/.*?(program studi|prodi|departemen|jurusan)\s*:\s*/i, '').trim();
                    if (cleanText) prodi = cleanText;
                }
            });

            if (!prodi) {
                // Fallback scan: check for common UT faculties/prodis in the HTML
                const html = res.data;
                const prodis = [
                    'Sistem Informasi', 'Teknik Informatika', 'Ilmu Hukum', 'Manajemen', 
                    'Akuntansi', 'Sosiologi', 'Ilmu Komunikasi', 'Administrasi Bisnis',
                    'Administrasi Negara', 'Sastra Inggris', 'Matematika', 'Statistika'
                ];
                for (const p of prodis) {
                    if (html.includes(p)) {
                        prodi = p;
                        break;
                    }
                }
            }

            return {
                name: name || 'Fadjar Setiawan',
                prodi: prodi || 'Sistem Informasi'
            };
        } catch (e) {
            console.warn('[Scraper] Failed to fetch academic details:', e.message);
            return {
                name: 'Fadjar Setiawan',
                prodi: 'Sistem Informasi'
            };
        }
    }

    /**
     * Upload a binary buffer to Moodle's draft area.
     * @param {string} draftItemId
     * @param {string} sesskey
     * @param {Buffer} fileBuffer
     * @param {string} fileName
     * @param {string} author
     * @param {string} repoId
     * @returns {Promise<object>} JSON response from Moodle
     */
    async uploadFileToDraftArea(draftItemId, sesskey, fileBuffer, fileName, author, repoId = '4') {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('repo_id', repoId);
        form.append('p', '');
        form.append('saveas', fileName);
        form.append('author', author || '');
        form.append('license', 'unknown');
        form.append('itemid', draftItemId);
        form.append('sesskey', sesskey);
        form.append('title', fileName);
        form.append('repo_upload_file', fileBuffer, {
            filename: fileName,
            contentType: 'application/octet-stream'
        });

        console.log(`[Scraper] Uploading file to draft area. ItemId: ${draftItemId}, File: ${fileName}, Author: ${author}, RepoId: ${repoId}`);

        const res = await this.client.post('/repository/repository_ajax.php?action=upload', form, {
            headers: {
                'Cookie': this._cookieHeader(),
                ...form.getHeaders()
            },
            timeout: 20000 // 20s timeout for file upload
        });

        return res.data;
    }

    /**
     * Download a file from Moodle using current authenticated cookies and return as base64.
     */
    async downloadMoodleFileBase64(url) {
        console.log(`[Scraper] Downloading Moodle file from: ${url}`);
        const res = await this.authenticatedGet(url, {
            responseType: 'arraybuffer',
            timeout: 25000
        });
        return Buffer.from(res.data).toString('base64');
    }

    /**
     * Resolve Moodle resource or URL wraps to their underlying direct file / video / external link.
     */
    async resolveRealResourceUrl(url) {
        if (!url || !url.startsWith('http')) return url;
        
        const isResource = url.includes('/mod/resource/');
        const isUrl = url.includes('/mod/url/');
        if (!isResource && !isUrl) return url;
        
        try {
            const response = await this.client.get(url, { timeout: 6000 });
            const html = response.data;
            const cheerio = require('cheerio');
            const $ = cheerio.load(html);
            
            // 1. Try .resourceworkaround or .urlworkaround links (standard in Moodle)
            const workaroundLink = $('.resourceworkaround a, .urlworkaround a').attr('href');
            if (workaroundLink) return workaroundLink;
            
            // 2. Try iframe src (often used for embedded PDF/videos/external sites)
            const iframeSrc = $('iframe').attr('src');
            if (iframeSrc) return iframeSrc;
            
            // 3. Try object data (often used for embedded PDFs)
            const objectData = $('object').attr('data');
            if (objectData) return objectData;
            
            // 4. Try any direct links to pluginfile.php
            let pluginLink = null;
            $('a[href*="pluginfile.php"]').each((_, el) => {
                const href = $(el).attr('href');
                if (href && !href.includes('forcedownload=1')) {
                    pluginLink = href;
                }
            });
            if (pluginLink) return pluginLink;
            
            return url;
        } catch (err) {
            console.warn(`[Scraper] Failed to resolve real resource URL for ${url}:`, err.message);
            return url;
        }
    }
}

module.exports = MoodleScraper;
