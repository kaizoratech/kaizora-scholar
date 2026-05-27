const express  = require('express');
const router   = express.Router();

const { syncLimiter, aiLimiter } = require('../config/security');
const {
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
} = require('../controllers/auth.controller');

// ── Sync (The Crawler Engine) ─────────────────────────────────────────────────
// Protected by rate limiter: max 5 calls per 15 min per IP
router.post('/auth/sync', syncLimiter, syncHandler);
router.post('/auth/resync', syncLimiter, resyncHandler);
router.post('/auth/upgrade', upgradeHandler);
router.post('/auth/topup', topUpHandler);
router.post('/auth/google-login', googleLoginHandler);
router.get('/auth/token-logs', getTokenLogsHandler);

// ── Course Data ───────────────────────────────────────────────────────────────
router.get('/courses',           getCoursesHandler);
router.get('/courses/:id/data',  getCourseDataHandler);

// ── Automations (One-Click Bypasses) ─────────────────────────────────────────
router.post('/courses/:id/complete-all-attendance', completeAllAttendanceHandler);
router.post('/courses/:id/mark-all-done',          markAllDoneHandler);
router.post('/courses/:id/submit-discussion',      submitDiscussionHandler);
router.post('/courses/:id/submit-assignment',      submitAssignmentHandler);
router.post('/tasks/:id/bypass-attendance',        bypassSingleAttendanceHandler);

// ── AI Generation (The Alchemist) ─────────────────────────────────────────────
// Protected by rate limiter: max 20 calls per 10 min per IP
router.post('/ai/generate-task', aiLimiter, generateTaskDraftHandler);

module.exports = router;
