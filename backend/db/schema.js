const { pgTable, uuid, varchar, text, integer, smallint, timestamp, index, unique } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');

// Users Table: UUID PK, unique ut_username
const users = pgTable('users', {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    authProvider: varchar('auth_provider', { length: 50 }).default('email').notNull(),
    utUsername: varchar('ut_username', { length: 255 }).unique(), // Nullable
    utPassword: text('ut_password'), // Nullable
    packageType: varchar('package_type', { length: 50 }).default('free').notNull(),
    tokensUsed: integer('tokens_used').default(0).notNull(),
    tokensMax: integer('tokens_max').default(10000).notNull(),
    aiTokensPurchased: integer('ai_tokens_purchased').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// Courses Table: One-to-Many with users, ut_course_id is indexed, composite unique index
const courses = pgTable('courses', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    utCourseId: varchar('ut_course_id', { length: 100 }).notNull(),
    name: text('name').notNull(),
    lastSynced: timestamp('last_synced').defaultNow()
}, (table) => {
    return {
        utCourseIdIdx: index('ut_course_id_idx').on(table.utCourseId),
        userCourseUnique: unique('user_course_unique').on(table.userId, table.utCourseId)
    };
});

// Sessions Table: One-to-Many with courses, ON DELETE CASCADE
const sessions = pgTable('sessions', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    sessionNumber: smallint('session_number').notNull(),
    title: text('title').notNull()
}, (table) => {
    return {
        courseSessionUnique: unique('course_session_unique').on(table.courseId, table.sessionNumber)
    };
});

// Materials Table: One-to-Many with sessions, ON DELETE CASCADE
const materials = pgTable('materials', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    sessionId: integer('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // 'PDF', 'Video', 'Link', etc.
    title: text('title').notNull(),
    originalUrl: text('original_url').notNull(),
    aiSummaryText: text('ai_summary_text'),
    aiAudioUrl: text('ai_audio_url'),
    completionUrl: text('completion_url'),
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
    return {
        sessionUrlUnique: unique('session_url_unique').on(table.sessionId, table.originalUrl)
    };
});

// Tasks Table: One-to-Many with sessions, ON DELETE CASCADE
const tasks = pgTable('tasks', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    sessionId: integer('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // 'Diskusi', 'Tugas', 'Kuis'
    title: text('title').notNull(),
    description: text('description'),
    deadline: timestamp('deadline'),
    status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'drafted', 'submitted'
    aiDraftAnswer: text('ai_draft_answer'),
    aiSessionState: varchar('ai_session_state', { length: 50 }).default('idle').notNull(), // 'idle', 'interrogation', 'activation', 'evaluated'
    aiContextForm: text('ai_context_form'), // stores stringified JSON
    aiSocraticQuestion: text('ai_socratic_question'),
    aiSocraticAnswer: text('ai_socratic_answer'),
    completionUrl: text('completion_url'),
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
    return {
        sessionTaskTitleUnique: unique('session_task_title_unique').on(table.sessionId, table.title)
    };
});

// Token Logs Table: One-to-Many with users, ON DELETE CASCADE
const tokenLogs = pgTable('token_logs', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    activityType: varchar('activity_type', { length: 100 }).notNull(), // 'ALCHEMIST_SUMMARY', 'TASK_DRAFT', 'DISCUSSION_DRAFT', 'TOP_UP'
    courseName: text('course_name'),
    sessionNumber: smallint('session_number'),
    tokensSwapped: integer('tokens_swapped').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

module.exports = {
    users,
    courses,
    sessions,
    materials,
    tasks,
    tokenLogs
};
