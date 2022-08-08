import randToken from "rand-token";
import jwt from "jsonwebtoken";
import key from "../config/secretkey";

const secretKey = key.secretKey;
const options = key.option;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
 
module.exports = {
    sign: async (user) => {
        const payload = {
            idx: user.member_id,
            nick: user.user_nick
        }

        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: randToken.uid(512)
        }

        return result;
    },
    verify: async (token) => {
        let decoded;
        
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === "jwt expired") return TOKEN_EXPIRED;
            return TOKEN_INVALID;
        }

        return decoded;
    }
}