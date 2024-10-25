import jwt from "jsonwebtoken";
import {loadDotEnv} from "../utils/loadDotEnv.js";

loadDotEnv()

const requiredEnvVariables = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION_TIME: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    REFRESH_TOKEN_EXPIRATION_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
};

for (const [key, value] of Object.entries(requiredEnvVariables)) {
    if (!value) {
        throw new Error(`Missing ${key}`);
    }
}
const {
    REFRESH_TOKEN_EXPIRATION_TIME,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION_TIME,
    ACCESS_TOKEN_SECRET
} = requiredEnvVariables

export default class Jwt {
    static  createAccessToken(payload: string) {
        return jwt.sign({username: payload}, ACCESS_TOKEN_SECRET!, {expiresIn: ACCESS_TOKEN_EXPIRATION_TIME})
    }

    static createRefreshToken(payload: string) {
        return jwt.sign({username: payload}, REFRESH_TOKEN_SECRET!, {expiresIn: REFRESH_TOKEN_EXPIRATION_TIME!})
    }

    static verifyToken(token: string, type: "access" | "refresh"): boolean {
        let success = true;

        const tokenSecret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET

        const separateToken = type ==="access" ? token.split(" ")[1] : token
        jwt.verify(separateToken,  tokenSecret!, (error) => {
            if (error) {
                console.log(error)
                success = false
            }
        })

        return success;
    }
}