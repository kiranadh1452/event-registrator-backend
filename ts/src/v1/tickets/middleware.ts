import { Request, Response, NextFunction } from "express";

import UserModule from "../users";
import EventModule from "../events";
import { sendErrorResponse } from "./helpers/responseHandler";

export const userAuthenticatorForTicketsMiddleware =
    UserModule.Middleware.checkUserAuthentication;

/**
 * @Usage_Of_This_Middleware
 * While requesting for tickets, the user can either request for tickets that they own
 * Or, the user can request for tickets of an event that they are the organizer of
 * To ensure that only these two casees are allowed, this middleware is used
 */
export const isRequestingUserAllowedToQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // let's take out the event id and user id from the request object
    const eventId = req.query?.eventId || req.body?.eventId;
    const userId = req.query?.userId || req.body?.userId;

    // If there is an userId field, check whether the requesting user has this id so that only tickets owned by the user can be viewed
    if (userId && userId === res.locals.authData.uid) return next();

    // If userId is not present or if the userId is not the same as the requesting user's id
    // Check whether the requesting user is the organizer of the event
    if (eventId) {
        req.params.id = eventId;

        // now that the id field has eventId, check whether the requesting user is the organizer of the event
        return EventModule.Middleware.isCurrentUserEventOrganizer(
            req,
            res,
            next
        );
    }

    // However, if none of userId or eventId is present, return 400
    return sendErrorResponse(
        res,
        400,
        "Bad Request",
        !userId && !eventId
            ? "Provide at least one of userId or eventId"
            : "You can only view tickets that you own or tickets of events that you organize"
    );
};
