const { db } = require('../config/db');
const { tasks, sessions, courses, users } = require('../db/schema');
const { eq, and } = require('drizzle-orm');

class TaskRepository {
    /**
     * Upsert a task using session ID and task title to prevent duplicates.
     */
    static async upsertTask(sessionId, type, title, description, deadline, status = 'pending', completionUrl = null) {
        const existing = await db.select().from(tasks).where(
            and(eq(tasks.sessionId, sessionId), eq(tasks.title, title))
        ).limit(1);

        if (existing.length > 0) {
            const task = existing[0];
            const updatePayload = {
                type,
                description: description || task.description,
                deadline: deadline ? new Date(deadline) : null,
                completionUrl: completionUrl || task.completionUrl
            };

            // Only update status if Moodle shows it is submitted/completed, OR if the current status is just 'pending'
            if (status === 'submitted' || task.status === 'pending') {
                updatePayload.status = status;
            }

            const result = await db.update(tasks)
                .set(updatePayload)
                .where(eq(tasks.id, task.id))
                .returning();
            return result[0];
        } else {
            const result = await db.insert(tasks)
                .values({
                    sessionId,
                    type,
                    title,
                    description,
                    deadline: deadline ? new Date(deadline) : null,
                    status,
                    completionUrl
                })
                .returning();
            return result[0];
        }
    }

    /**
     * Save the AI generated draft answer and change task status to drafted.
     */
    static async updateTaskDraft(taskId, aiDraftAnswer) {
        const result = await db.update(tasks)
            .set({
                aiDraftAnswer,
                status: 'drafted'
            })
            .where(eq(tasks.id, taskId))
            .returning();
        return result[0];
    }

    /**
     * Fetch task details along with session, course, and user context.
     * Prevents raw input queries and CWE-89 SQL Injection.
     */
    static async getTaskWithContext(taskId) {
        const result = await db.select({
            task: tasks,
            sessionTitle: sessions.title,
            courseName: courses.name,
            user: {
                id: users.id,
                email: users.email,
                utUsername: users.utUsername,
                utPassword: users.utPassword
            }
        })
        .from(tasks)
        .innerJoin(sessions, eq(tasks.sessionId, sessions.id))
        .innerJoin(courses, eq(sessions.courseId, courses.id))
        .innerJoin(users, eq(courses.userId, users.id))
        .where(eq(tasks.id, taskId))
        .limit(1);

        return result[0] || null;
    }

    /**
     * Update task status and draft answer text in a single transaction.
     */
    static async updateTaskStatusAndAnswer(taskId, status, aiDraftAnswer = null) {
        const setPayload = { status };
        if (aiDraftAnswer !== null) {
            setPayload.aiDraftAnswer = aiDraftAnswer;
        }
        const result = await db.update(tasks)
            .set(setPayload)
            .where(eq(tasks.id, taskId))
            .returning();
        return result[0];
    }

    /**
     * Update AI conversational session attributes of a task.
     */
    static async updateTaskAiSession(taskId, updates) {
        const setPayload = {};
        if (updates.aiSessionState !== undefined) setPayload.aiSessionState = updates.aiSessionState;
        if (updates.aiContextForm !== undefined) setPayload.aiContextForm = updates.aiContextForm;
        if (updates.aiSocraticQuestion !== undefined) setPayload.aiSocraticQuestion = updates.aiSocraticQuestion;
        if (updates.aiSocraticAnswer !== undefined) setPayload.aiSocraticAnswer = updates.aiSocraticAnswer;
        if (updates.aiDraftAnswer !== undefined) setPayload.aiDraftAnswer = updates.aiDraftAnswer;
        if (updates.status !== undefined) setPayload.status = updates.status;

        const result = await db.update(tasks)
            .set(setPayload)
            .where(eq(tasks.id, taskId))
            .returning();
        return result[0];
    }
}

module.exports = TaskRepository;
