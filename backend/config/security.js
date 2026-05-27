const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for the sync endpoint — the most expensive operation.
 * Prevents abuse and protects shared hosting CPU/RAM.
 * 5 sync requests per 15 minutes per IP.
 */
const syncLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max:      process.env.NODE_ENV === 'development' ? 100 : 5,
    message: {
        success: false,
        message: 'Terlalu banyak request sync. Coba lagi dalam 15 menit.',
    },
    standardHeaders: true,
    legacyHeaders:   false,
});

/**
 * Rate limiter for AI generation endpoints.
 * 20 requests per 10 minutes per IP.
 */
const aiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutes
    max:      20,
    message: {
        success: false,
        message: 'Terlalu banyak request AI. Coba lagi sebentar.',
    },
    standardHeaders: true,
    legacyHeaders:   false,
});

module.exports = { syncLimiter, aiLimiter };
