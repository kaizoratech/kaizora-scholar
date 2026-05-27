const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('../db/schema');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('[DB Config] DATABASE_URL is not set in your .env file.');
}

// Set up node-postgres Pool pointing directly to the Connection Pooler URI
const pool = new Pool({
    connectionString,
    max: 10, // Optimize for shared hosting / serverless connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('[DB Pool] Unexpected error on idle client:', err.message);
});

const db = drizzle(pool, { schema });

/**
 * Self-contained transactional DDL schema initialization.
 * Automatically deploys and synchronizes structural schemas remotely on Supabase.
 */
async function initializeDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Enable pgcrypto extension for UUID generation inside Supabase schema
        await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

        // 1. Users Table (UUID PK)
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) NOT NULL UNIQUE,
                full_name TEXT,
                avatar_url TEXT,
                auth_provider VARCHAR(50) DEFAULT 'email' NOT NULL,
                ut_username VARCHAR(255) UNIQUE,
                ut_password TEXT,
                package_type VARCHAR(50) DEFAULT 'free' NOT NULL,
                tokens_used INTEGER DEFAULT 0 NOT NULL,
                tokens_max INTEGER DEFAULT 10000 NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
            )
        `);

        // 2. Courses Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
                ut_course_id VARCHAR(100) NOT NULL,
                name TEXT NOT NULL,
                last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                CONSTRAINT user_course_unique UNIQUE (user_id, ut_course_id)
            )
        `);

        // Course Index for fast crawler UPSERT optimization
        await client.query(`
            CREATE INDEX IF NOT EXISTS ut_course_id_idx ON courses(ut_course_id)
        `);

        // 3. Sessions Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
                session_number SMALLINT NOT NULL,
                title TEXT NOT NULL,
                CONSTRAINT course_session_unique UNIQUE (course_id, session_number)
            )
        `);

        // 4. Materials Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS materials (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
                type VARCHAR(50) NOT NULL,
                title TEXT NOT NULL,
                original_url TEXT NOT NULL,
                ai_summary_text TEXT,
                ai_audio_url TEXT,
                completion_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
                CONSTRAINT session_url_unique UNIQUE (session_id, original_url)
            )
        `);

        // 5. Tasks Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
                type VARCHAR(50) NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                deadline TIMESTAMP WITH TIME ZONE,
                status VARCHAR(50) DEFAULT 'pending' NOT NULL,
                ai_draft_answer TEXT,
                ai_session_state VARCHAR(50) DEFAULT 'idle' NOT NULL,
                ai_context_form TEXT,
                ai_socratic_question TEXT,
                ai_socratic_answer TEXT,
                completion_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
                CONSTRAINT session_task_title_unique UNIQUE (session_id, title)
            )
        `);

        // 6. Token Logs Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS token_logs (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
                activity_type VARCHAR(100) NOT NULL,
                course_name TEXT,
                session_number SMALLINT,
                tokens_swapped INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
            )
        `);

        // Run direct incremental DDL migrations to safely upgrade existing client tables
        await client.query('ALTER TABLE materials ADD COLUMN IF NOT EXISTS completion_url TEXT');
        await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completion_url TEXT');
        await client.query("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS ai_session_state VARCHAR(50) DEFAULT 'idle' NOT NULL");
        await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS ai_context_form TEXT');
        await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS ai_socratic_question TEXT');
        await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS ai_socratic_answer TEXT');
        await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS package_type VARCHAR(50) DEFAULT 'free' NOT NULL");
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0 NOT NULL');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS tokens_max INTEGER DEFAULT 10000 NOT NULL');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_tokens_purchased INTEGER DEFAULT 0 NOT NULL');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');
        await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email' NOT NULL");
        await client.query('ALTER TABLE users ALTER COLUMN ut_username DROP NOT NULL');
        await client.query('ALTER TABLE users ALTER COLUMN ut_password DROP NOT NULL');

        await client.query('COMMIT');
        console.log('[DB Initialization] Database schema remote Supabase sync complete.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('[DB Initialization] Transaction aborted on remote Supabase sync:', err.message);
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    pool,
    db,
    initializeDatabase
};
