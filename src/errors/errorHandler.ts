import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

export const errorHandler = (err: Error & {statusCode?:number}, req:Request, res:Response, next:NextFunction)=>{
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong, try again later"

    const reply = {
        success: false,
        error:message
    }

    res.status(statusCode).json(reply)
}
