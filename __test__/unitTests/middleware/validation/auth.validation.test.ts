import { describe, it, expect, vi } from 'vitest';
import { NextFunction, Response, Request } from 'express';
import AuthValidation from "../../../../src/middleware/validation/auth.validation.js";
import Jwt from "../../../../src/lib/jwt.js";
import {UnauthorizedError} from "../../../../src/errors/customErrors.js";


describe('AuthValidation', () => {
    describe('validateAccessToken', () => {
        it('should call next() if access token is valid', () => {
            const req = {
                headers: {
                    authorization: 'validAccessToken',
                },
            } as Request;

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.spyOn(Jwt, 'verifyToken').mockReturnValue(true);

            AuthValidation.validateAccessToken(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should throw UnauthorizedError if access token is missing', () => {
            const req = {
                headers: {},
            } as Request;

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            expect(() => AuthValidation.validateAccessToken(req, res, next)).toThrow(UnauthorizedError);
            expect(() => AuthValidation.validateAccessToken(req, res, next)).toThrow("Access denied. Access token missing. You have to log in first.");
        });

        it('should throw UnauthorizedError if access token is invalid', () => {
            const req = {
                headers: {
                    authorization: 'invalidAccessToken',
                },
            } as Request;

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.spyOn(Jwt, 'verifyToken').mockReturnValue(false); // Mocking verifyToken to return false

            expect(() => AuthValidation.validateAccessToken(req, res, next)).toThrow(UnauthorizedError);
            expect(() => AuthValidation.validateAccessToken(req, res, next)).toThrow("Access denied. Access token invalid. You have to log in again.");
        });
    });
});