import crypto from "crypto";

const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });

module.exports = async (plainPassword, status, user_salt) =>
    new Promise(async (resolve, reject) => {
        const salt = status === 0? await createSalt() : user_salt;
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ password: key.toString('base64'), salt });
        });
    });
