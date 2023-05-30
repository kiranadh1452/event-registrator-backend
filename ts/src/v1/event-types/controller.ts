import { Request, Response, NextFunction } from "express";

import {
    sendSuccessResponse,
    sendErrorResponse,
} from "./helpers/responseHandler";

export const getAllEventTypesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error");
    }
};

export const createEventTypeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error");
    }
};

export const getEventTypeByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error");
    }
};

export const updateEventTypeByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error");
    }
};

export const deleteEventTypeByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error");
    }
};
