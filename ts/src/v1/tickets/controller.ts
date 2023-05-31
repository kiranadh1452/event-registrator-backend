import { Request, Response, NextFunction } from "express";
import {
    sendErrorResponse,
    sendSuccessResponse,
} from "./helpers/responseHandler";

import Ticket from "./model";
import Event from "../events/model";

// get all tickets
export const getTicketsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tickets = await Ticket.fetchTickets(req.query);
        return sendSuccessResponse(res, 200, "Success", tickets);
    } catch (error: any) {
        return sendErrorResponse(res, 500, "Internal Server Error");
    }
};

// create a new ticket
export const createTicketController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // prevent from adding the user id from the request body
        if (req.body.userId) delete req.body.userId;

        const userId = res.locals?.authData?.uid;
        const ticketQuantity = 1; // it is 1 for now

        // see if the event is a valid one
        const event = await Event.findOne({ _id: { $eq: req.body.eventId } });
        if (!event || !event.priceId) {
            return sendErrorResponse(res, 404, "Event or price not found");
        }

        // if the event has seat limit, check if the event has ticketQuantity number of tickets left
        if (
            event.maxTickets &&
            event.maxTickets - event.ticketsSold < ticketQuantity
        ) {
            return sendErrorResponse(res, 409, "Ticket limit reached");
        }

        // issue a new ticket
        const ticketData = await Ticket.createTicket({
            ...req.body,
            userId,
            priceId: event.priceId,
        });

        return sendSuccessResponse(
            res,
            201,
            "Ticket created successfully",
            ticketData
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

// get a specific ticket
export const getTicketByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        return sendErrorResponse(res, 500, "Internal Server Error");
    }
};
