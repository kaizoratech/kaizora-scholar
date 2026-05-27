const { db } = require('../config/db');
const { users } = require('../db/schema');
const { eq, sql } = require('drizzle-orm');

class UserRepository {
    /**
     * Upsert a user based on their email.
     * Prevents race conditions and safely updates credentials.
     * @param {string} email 
     * @param {string} utUsername 
     * @param {string} utPassword 
     * @returns {Promise<object>} The upserted user record
     */
    static async upsertUser(email, utUsername, utPassword, fullName = null, avatarUrl = null, authProvider = 'email') {
        const values = {
            email,
            authProvider
        };
        if (utUsername !== undefined) values.utUsername = utUsername;
        if (utPassword !== undefined) values.utPassword = utPassword;
        if (fullName !== null) values.fullName = fullName;
        if (avatarUrl !== null) values.avatarUrl = avatarUrl;

        const setObj = { authProvider };
        if (utUsername !== undefined) setObj.utUsername = utUsername;
        if (utPassword !== undefined) setObj.utPassword = utPassword;
        if (fullName !== null) setObj.fullName = fullName;
        if (avatarUrl !== null) setObj.avatarUrl = avatarUrl;

        const result = await db.insert(users)
            .values(values)
            .onConflictDoUpdate({
                target: users.email,
                set: setObj
            })
            .returning();
        return result[0];
    }

    /**
     * Bind UT Username (NIM) and utPassword to a user.
     * @param {string} userId
     * @param {string} utUsername
     * @param {string} utPassword
     * @returns {Promise<object>} The updated user record
     */
    static async bindUtAccount(userId, utUsername, utPassword) {
        const result = await db.update(users)
            .set({
                utUsername,
                utPassword
            })
            .where(eq(users.id, userId))
            .returning();
        return result[0];
    }

    /**
     * Find a user by their email address.
     * @param {string} email 
     * @returns {Promise<object|null>}
     */
    static async findByEmail(email) {
        const result = await db.select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        return result[0] || null;
    }

    /**
     * Find a user by their UUID.
     * @param {string} id 
     * @returns {Promise<object|null>}
     */
    static async findById(id) {
        const result = await db.select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return result[0] || null;
    }

    /**
     * Find a user by their UT Username / NIM.
     * @param {string} utUsername 
     * @returns {Promise<object|null>}
     */
    static async findByUtUsername(utUsername) {
        const result = await db.select()
            .from(users)
            .where(eq(users.utUsername, utUsername))
            .limit(1);
        return result[0] || null;
    }

    /**
     * Update user tokens and package type.
     */
    static async updateUserTokens(id, tokensUsed, tokensMax, packageType) {
        const setClause = {};
        if (tokensUsed !== undefined) setClause.tokensUsed = tokensUsed;
        if (tokensMax !== undefined) setClause.tokensMax = tokensMax;
        if (packageType !== undefined) setClause.packageType = packageType;

        const result = await db.update(users)
            .set(setClause)
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    /**
     * Increment user tokens used by a certain amount.
     */
    static async incrementTokens(id, amount) {
        const result = await db.update(users)
            .set({
                tokensUsed: sql`tokens_used + ${amount}`
            })
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    /**
     * Deduct tokens securely using a transaction block and log to token_logs.
     */
    static async deductTokensWithAudit(userId, amount, activityType, courseName = null, sessionNumber = null) {
        return await db.transaction(async (tx) => {
            // 1. Fetch user data inside transaction
            const userResult = await tx.select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);
            const user = userResult[0];
            if (!user) throw new Error('User tidak ditemukan.');

            const tokensMax = user.tokensMax;
            const tokensUsed = user.tokensUsed;
            const aiTokensPurchased = user.aiTokensPurchased || 0;

            let newTokensUsed = tokensUsed;
            let newAiTokensPurchased = aiTokensPurchased;

            const remainingMonthly = Math.max(0, tokensMax - tokensUsed);

            if (amount <= remainingMonthly) {
                newTokensUsed = tokensUsed + amount;
            } else {
                newTokensUsed = tokensMax;
                const excess = amount - remainingMonthly;
                newAiTokensPurchased = Math.max(0, aiTokensPurchased - excess);
            }

            // 2. Update user token balance
            const updatedUsers = await tx.update(users)
                .set({
                    tokensUsed: newTokensUsed,
                    aiTokensPurchased: newAiTokensPurchased
                })
                .where(eq(users.id, userId))
                .returning();

            // 3. Insert mutation log to token_logs
            const { tokenLogs } = require('../db/schema');
            await tx.insert(tokenLogs)
                .values({
                    userId,
                    activityType,
                    courseName,
                    sessionNumber: sessionNumber ? parseInt(sessionNumber) : null,
                    tokensSwapped: -amount // pemotongan bertanda negatif
                });

            return updatedUsers[0];
        });
    }

    /**
     * Top up tokens securely and log to token_logs.
     */
    static async topUpTokensWithAudit(userId, amount, packageBoostName) {
        return await db.transaction(async (tx) => {
            const updatedUsers = await tx.update(users)
                .set({
                    aiTokensPurchased: sql`ai_tokens_purchased + ${amount}`
                })
                .where(eq(users.id, userId))
                .returning();

            const { tokenLogs } = require('../db/schema');
            await tx.insert(tokenLogs)
                .values({
                    userId,
                    activityType: 'TOP_UP',
                    courseName: `Top Up Paket ${packageBoostName}`,
                    sessionNumber: null,
                    tokensSwapped: amount // penambahan bertanda positif
                });

            return updatedUsers[0];
        });
    }

    /**
     * Get all token logs for a user.
     */
    static async getTokenLogs(userId) {
        const { tokenLogs } = require('../db/schema');
        const { desc } = require('drizzle-orm');
        return await db.select()
            .from(tokenLogs)
            .where(eq(tokenLogs.userId, userId))
            .orderBy(desc(tokenLogs.createdAt));
    }
}

module.exports = UserRepository;
