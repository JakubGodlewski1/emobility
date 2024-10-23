import {NextFunction, Response, Request} from "express";
import {loadDotEnv} from "../utils/loadDotEnv.js";
import {InternalError, UnauthorizedError} from "../errors/customErrors.js";

loadDotEnv()

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

if (!USERNAME || !PASSWORD) {
    throw new InternalError("Missing admin credentials on the server")
}

export default class AuthController {
    static signIn(req: Request, res: Response, next: NextFunction) {
        const {username, password} = req.body;
        if (username !== USERNAME || password !== PASSWORD) {
            throw new UnauthorizedError("Provided credentials are not correct")
        }
    }
}