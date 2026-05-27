require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const { initializeDatabase } = require('./config/db');
const apiRouter              = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
        if (isLocalhost || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        status:  'ok',
        service: 'Kaizora Scholar API',
        version: '1.0.0',
        time:    new Date().toISOString(),
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[Server] Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error:   process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// ── Boot Sequence ─────────────────────────────────────────────────────────────
async function boot() {
    try {
        console.log('[Boot] Initializing database schema...');
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`\n🚀 Kaizora Scholar API running on http://localhost:${PORT}`);
            console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
            console.log(`   CORS Origin : Dynamic (Localhost allowed)`);
            console.log(`   Health check: http://localhost:${PORT}/health\n`);
        });
    } catch (err) {
        console.error('[Boot] Fatal startup error:', err.message);
        process.exit(1);
    }
}

// ── Gemini Diagnostics ─────────────────────────────────────────────────────────
if (process.env.GEMINI_API_KEY) {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        genAI.listModels().then(res => {
            console.log('\n================================================================');
            console.log('[Gemini Diagnostics] SUCCESSFULLY CONNECTED!');
            console.log('[Gemini Diagnostics] Available models:', res.models.map(m => m.name.replace('models/', '')));
            console.log('================================================================\n');
        }).catch(err => {
            console.error('\n[Gemini Diagnostics] Failed to list models:', err.message);
        });
    } catch (err) {
        console.error('\n[Gemini Diagnostics] Error initializing diagnostics:', err.message);
    }
}

boot();
