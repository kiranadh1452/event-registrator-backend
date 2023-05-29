import { Request, Response, NextFunction } from "express";

import UserModule from "../users";
import Event from "./model";
import { sendErrorResponse } from "./helpers/responseHandler";

export const userAuthenticatorForEventsMiddleware =
    UserModule.Middleware.checkUserAuthentication;

export const isCurrentUserEventOrganizer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get the id from the request object
        const id = req.params?.id || req.query?.id;

        if (!id || !res.locals.authData) {
            return sendErrorResponse(res, 400, "Bad Request", "No id provided");
        }

        // find the event by id
        const event = await Event.findById(id);

        // if no event found, return 404
        if (!event) {
            return sendErrorResponse(res, 404, "Not Found");
        }

        // check if the current user is the organizer of the event
        if (event.organizerId !== res.locals.authData.uid) {
            return sendErrorResponse(res, 401, "Unauthorized", "Access Denied");
        }

        // Note that res.locals.current_event is a mongoose object which means we can perform actions like res.locals.current_event.save(), etc.
        res.locals.current_event = event;

        next();
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
