import {Request, Response} from "express";
import {loadDotEnv} from "../utils/loadDotEnv.js";
import {InternalError, UnauthorizedError} from "../errors/customErrors.js";
import Jwt from "../lib/jwt.js";
import {StatusCodes} from "http-status-codes";
import Cache from "../lib/cache.js";
import {Reply} from "../../types.js";

loadDotEnv()

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

if (!USERNAME || !PASSWORD) {
    throw new InternalError("Missing admin credentials on the server")
}

export default class AuthController {
    static signIn(req: Request, res: Response) {
        const {username, password} = req.body;

        //validate credentials
        if (username !== USERNAME || password !== PASSWORD) {
            throw new UnauthorizedError("Provided credentials are not correct")
        }

        const {createAccessToken, createRefreshToken} = Jwt
        //create access token
       const accessToken = createAccessToken(USERNAME!)

        //create refresh token and append it to cookies
        const refreshToken = createRefreshToken(USERNAME!)
        const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000 //7 days
        res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: refreshTokenMaxAge})

        //safe the token in memory cache
        Cache.set("refreshToken", refreshToken, refreshTokenMaxAge)

        res.status(StatusCodes.OK).json({
            success:true,
            data: {accessToken},
        })
    }

    static refresh(req: Request, res: Response) {
        const refreshToken = req.cookies?.jwt

        if (!refreshToken)
            throw new UnauthorizedError("Access forbidden")

        //validate token
        const tokenIsValid = Jwt.verifyToken(refreshToken, "refresh")

        //check if user has not signed out (compare cached token to the sent token)
        const cachedToken =  Cache.get("refreshToken")
        const userLoggedOut = cachedToken !== refreshToken


        if (!tokenIsValid || userLoggedOut)
            throw new UnauthorizedError("Unable to verify refresh token, log in again")

        const accessToken = Jwt.createAccessToken(USERNAME!)
        const reply: Reply = {success: true, data: {accessToken}};
        res.json(reply)
    }

    static logout = async (req: Request, res: Response) => {
        const accessToken = req.headers['authorization'];

        //delete refresh token from the cache
         Cache.delete("refreshToken")

        //delete refresh token from the cookie
        res.clearCookie("jwt", {httpOnly: true, maxAge: 0})

        //add current access token to a access token black list in the cache
        Cache.set("accessToken", accessToken, 1000*120) //120s ttl

        const reply: Reply = {success: true, data: null}
        res.status(StatusCodes.OK).json(reply)
    }
}