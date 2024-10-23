import {NextFunction, Response, Request} from "express";
import {loadDotEnv} from "../utils/loadDotEnv.js";
import {InternalError, UnauthorizedError} from "../errors/customErrors.js";
import Jwt from "../lib/jwt.js";
import {StatusCodes} from "http-status-codes";

loadDotEnv()

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

if (!USERNAME || !PASSWORD) {
    throw new InternalError("Missing admin credentials on the server")
}

export default class AuthController {
    static signIn(req: Request, res: Response, next: NextFunction) {
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
        res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})

        res.status(StatusCodes.OK).json({
            success:true,
            data: {accessToken},
        })
    }
}