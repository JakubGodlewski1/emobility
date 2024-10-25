import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {errorHandler} from "../../../src/errors/errorHandler.js";

describe('errorHandler middleware', () => {
    const config = (message?:string, statusCode?:number)=>{
        // Mock Request, Response, and NextFunction
        const req = {} as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;
        const next = vi.fn() as NextFunction;

        // Create the error object
        const error = new Error(message) as Error & { statusCode?: number };
        if (statusCode){
            error.statusCode = statusCode
        }

        // Call the errorHandler
        errorHandler(error, req, res, next);

        return {res}
    }

    it('should return status 500 and a default message when no statusCode is provided', () => {
        const {res} = config()

        // Assertions
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong, try again later',
            success:false
        });
    });

    it('should return the correct status code and message when statusCode and message are provided', () => {
        const {res} = config("Custom error message", 400)

        // Assertions
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Custom error message',
            success:false
        });
    });
});