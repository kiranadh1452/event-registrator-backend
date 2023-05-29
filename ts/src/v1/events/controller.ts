import { Request, Response, NextFunction } from "express";

import Event from "./model";
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
        const events = await Event.fetchEvents(req.query);
        return sendSuccessResponse(res, 200, "Success", events);
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
        // This prevents from adding the organizer id from the request body
        if (req.body.organizerId) delete req.body.organizerId;

        console.log("Organizer id: ", res.locals.authData.uid);

        // Add the current active user id as organizer id to the event data
        const eventData = await Event.createEvent({
            ...req.body,
            organizerId: res.locals.authData.uid,
        });

        return sendSuccessResponse(
            res,
            201,
            "Event created successfully",
            eventData
        );
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
        // get the id from the request object
        const id = req.params?.id || req.query?.id;

        // find the event by id
        const event = await Event.findById(id);
        return sendSuccessResponse(res, 200, "Success", event);
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
        const { id } = req.params;

        if (!id || typeof id !== "string") {
            return sendErrorResponse(res, 400, `Invalid user ID`);
        }

        const event = await Event.findById(id).exec();
        if (!event) {
            return sendErrorResponse(res, 404, `Event with id ${id} not found`);
        }

        await event.updateEvent(req.body);

        return sendSuccessResponse(
            res,
            200,
            "User updated successfully",
            event
        );
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
