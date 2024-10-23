import {NextFunction, Response, Request} from "express";
import Jwt from "../../lib/jwt.js";
import {UnauthorizedError} from "../../errors/customErrors.js";

export default class AuthValidation {
    static validateAccessToken = (req:Request, res:Response, next:NextFunction) => {
        const accessToken = req.headers['authorization'];
        if (!accessToken) {
           throw new UnauthorizedError("Access denied. Access token missing. You have to log in first.")
        }

        const success = Jwt.verifyAccessToken(accessToken)
        if (!success) {
            throw new UnauthorizedError("Access denied. Access token invalid. You have to log in again.")
        }

        next()
    }
}