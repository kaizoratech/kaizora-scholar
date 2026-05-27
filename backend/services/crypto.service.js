const crypto = require('crypto');
require('dotenv').config();

const ALGORITHM = 'aes-256-gcm';

// APP_KEY must be exactly 32 UTF-8 bytes for AES-256.
// Validate at load time so we fail fast rather than at runtime.
const rawKey = process.env.APP_KEY || '';
if (rawKey.length !== 32) {
    throw new Error(
        `[CryptoService] APP_KEY must be exactly 32 characters (got ${rawKey.length}). ` +
        `Update your .env file.`
    );
}

const KEY = Buffer.from(rawKey, 'utf8');

/**
 * AES-256-GCM encryption service.
 * Output format:  <iv_hex>:<authTag_hex>:<ciphertext_hex>
 *
 * This scheme provides both confidentiality (AES-CTR mode internally) and
 * integrity/authenticity (GCM auth tag), satisfying OWASP Cryptographic Failures
 * requirements for stored credentials.
 */
class CryptoService {
    /**
     * Encrypt plaintext string.
     * @param {string} text - Plaintext to encrypt.
     * @returns {string} Colon-delimited hex string: iv:authTag:ciphertext
     */
    static encrypt(text) {
        if (typeof text !== 'string' || !text) {
            throw new TypeError('[CryptoService] encrypt() requires a non-empty string.');
        }

        const iv = crypto.randomBytes(16); // 128-bit IV (recommended for GCM)
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex'); // 128-bit auth tag

        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    }

    /**
     * Decrypt a hash previously produced by encrypt().
     * @param {string} hash - Colon-delimited hex string: iv:authTag:ciphertext
     * @returns {string} Decrypted plaintext.
     */
    static decrypt(hash) {
        if (typeof hash !== 'string' || !hash) {
            throw new TypeError('[CryptoService] decrypt() requires a non-empty hash string.');
        }

        const parts = hash.split(':');
        if (parts.length !== 3) {
            throw new Error('[CryptoService] Invalid hash format. Expected iv:authTag:ciphertext.');
        }

        const iv            = Buffer.from(parts[0], 'hex');
        const authTag       = Buffer.from(parts[1], 'hex');
        const encryptedText = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8'); // throws if auth tag is invalid

        return decrypted;
    }
}

module.exports = CryptoService;
