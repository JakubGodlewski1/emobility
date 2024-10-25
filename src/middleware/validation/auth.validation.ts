import {NextFunction, Response, Request} from "express";
import Jwt from "../../lib/jwt.js";
import {UnauthorizedError} from "../../errors/customErrors.js";
import Cache from "../../lib/cache.js";

export default class AuthValidation {
    static validateAccessToken = (req:Request, res:Response, next:NextFunction) => {
        const accessToken = req.headers['authorization'];
        if (!accessToken) {
           throw new UnauthorizedError("Access denied. Access token missing. You have to log in first.")
        }

        //check if user did not sign out. if so, the prev access token will be blacklisted
        const prevAccessToken = Cache.get("accessToken")

        if (prevAccessToken && prevAccessToken === accessToken) {
            throw new UnauthorizedError("Access denied. Access token invalid. You have to log in again.")
        }

        //validate the access token
        const success = Jwt.verifyToken(accessToken, "access")
        if (!success) {
            throw new UnauthorizedError("Access denied. Access token invalid. You have to log in again.")
        }

        next()
    }
}