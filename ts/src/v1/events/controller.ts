import { Request, Response, NextFunction } from "express";

import {
    sendSuccessResponse,
    sendErrorResponse,
} from "./helpers/responseHandler";

export const getAllEventsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        console.log(error);
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

export const createEventController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        console.log(error);
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

export const getEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        console.log(error);
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

export const updateEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        console.log(error);
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

export const deleteEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        console.log(error);
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};
