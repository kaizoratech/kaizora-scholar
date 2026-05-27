const { db } = require('../config/db');
const { courses, sessions, materials, tasks, users } = require('../db/schema');
const { eq, and, inArray } = require('drizzle-orm');

class CourseRepository {
    /**
     * Upsert a course using atomic composite conflict handling.
     */
    static async upsertCourse(userId, utCourseId, name) {
        const result = await db.insert(courses)
            .values({
                userId,
                utCourseId,
                name,
                lastSynced: new Date()
            })
            .onConflictDoUpdate({
                target: [courses.userId, courses.utCourseId],
                set: {
                    name,
                    lastSynced: new Date()
                }
            })
            .returning();
        return result[0];
    }

    /**
     * Upsert a session (week/topic).
     */
    static async upsertSession(courseId, sessionNumber, title) {
        const result = await db.insert(sessions)
            .values({
                courseId,
                sessionNumber,
                title
            })
            .onConflictDoUpdate({
                target: [sessions.courseId, sessions.sessionNumber],
                set: {
                    title
                }
            })
            .returning();
        return result[0];
    }

    /**
     * Upsert a learning material.
     */
    static async upsertMaterial(sessionId, type, title, originalUrl, completionUrl) {
        const result = await db.insert(materials)
            .values({
                sessionId,
                type,
                title,
                originalUrl,
                completionUrl
            })
            .onConflictDoUpdate({
                target: [materials.sessionId, materials.originalUrl],
                set: {
                    type,
                    title,
                    completionUrl
                }
            })
            .returning();
        return result[0];
    }

    /**
     * Update material AI Summary text.
     */
    static async updateMaterialSummary(materialId, aiSummaryText) {
        const result = await db.update(materials)
            .set({ aiSummaryText })
            .where(eq(materials.id, materialId))
            .returning();
        return result[0];
    }

    /**
     * Get all courses belonging to a student email.
     */
    static async getCoursesByEmail(email) {
        const result = await db.select({
            id: courses.id,
            utCourseId: courses.utCourseId,
            name: courses.name,
            lastSynced: courses.lastSynced
        })
        .from(courses)
        .innerJoin(users, eq(courses.userId, users.id))
        .where(eq(users.email, email))
        .orderBy(courses.name);
        
        return result;
    }

    /**
     * Clear all materials and tasks associated with a course to ensure perfect freshness.
     */
    static async clearCourseActivities(courseId) {
        const dbSessions = await db.select({ id: sessions.id }).from(sessions).where(eq(sessions.courseId, courseId));
        const sessionIds = dbSessions.map(s => s.id);
        if (sessionIds.length === 0) return;

        await Promise.all([
            db.delete(materials).where(inArray(materials.sessionId, sessionIds)),
            db.delete(tasks).where(inArray(tasks.sessionId, sessionIds))
        ]);
    }

    /**
     * Retrieve all course sections, including pre-joined materials and tasks.
     * Prevents N+1 queries.
     */
    static async getCourseData(courseId) {
        // Fetch sessions
        const dbSessions = await db.select()
            .from(sessions)
            .where(eq(sessions.courseId, courseId))
            .orderBy(sessions.sessionNumber);

        const sessionIds = dbSessions.map(s => s.id);
        
        if (sessionIds.length === 0) {
            return [];
        }

        // Fetch materials and tasks in parallel for these sessions
        const [dbMaterials, dbTasks] = await Promise.all([
            db.select().from(materials).where(inArray(materials.sessionId, sessionIds)),
            db.select().from(tasks).where(inArray(tasks.sessionId, sessionIds))
        ]);

        // Map them together
        return dbSessions.map(session => ({
            ...session,
            materials: dbMaterials.filter(m => m.sessionId === session.id),
            tasks: dbTasks.filter(t => t.sessionId === session.id)
        }));
    }

    /**
     * Retrieve a course by its database ID.
     */
    static async getCourseById(courseId) {
        const result = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
        return result[0] || null;
    }
}

module.exports = CourseRepository;
