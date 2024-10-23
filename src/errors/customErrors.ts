import {StatusCodes} from "http-status-codes";

export class NotFoundError extends Error {
    statusCode = StatusCodes.NOT_FOUND
}

export class InternalError extends Error {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
}

export class BadRequestError extends Error {
    statusCode = StatusCodes.BAD_REQUEST;
}

export class UnauthorizedError extends Error {
    statusCode = StatusCodes.FORBIDDEN
}

export class UnauthenticatedError extends Error {
    statusCode = StatusCodes.UNAUTHORIZED;
}