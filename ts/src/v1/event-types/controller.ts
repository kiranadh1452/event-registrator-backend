import { Request, Response, NextFunction } from "express";

import EventType from "./model";

import {
    sendSuccessResponse,
    sendErrorResponse,
} from "./helpers/responseHandler";
import { IEventType } from "./helpers/types";

export const getAllEventTypesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const eventTypes = await EventType.fetchEventTypes(req.query);
        return sendSuccessResponse(res, 200, "Success", eventTypes);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal server error",
            error.message
        );
    }
};

export const createEventTypeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get the current user id
        const userId = res.locals?.authData?.uid;

        // create a new event type
        const newEventType = await EventType.createEventType({
            ...req.body,
            createdBy: userId,
        });

        return sendSuccessResponse(res, 201, "Success", newEventType);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal server error",
            error.message
        );
    }
};

export const getEventTypeByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get the event type id from the request params
        const id = req.params?.id || req.query?.id;

        // find the event-type by id
        const eventType = await EventType.findOne({ _id: { $eq: id } });
        return sendSuccessResponse(res, 200, "Success", eventType);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal server error",
            error.message
        );
    }
};

export const updateEventTypeByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // get the current user id
        const userId = res.locals?.authData?.uid;

        const eventType: IEventType | null = await EventType.findOne({
            _id: { $eq: id },
        }).exec();

        if (!eventType)
            return sendErrorResponse(
                res,
                404,
                "Not found",
                "No such event type found"
            );

        // can anyone change the type?
        // For now, the one who created the type can only change the typ
        if (eventType?.createdBy?.toString() !== userId || !userId) {
            return sendErrorResponse(
                res,
                403,
                "Forbidden",
                "You are not allowed to perform this operation"
            );
        }

        // update the event
        await eventType.updateEventType(req.body);

        return sendSuccessResponse(res, 200, "Success", eventType);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal server error",
            error.message
        );
    }
};

export const deleteEventTypeByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal server error",
            error.message
        );
    }
};
