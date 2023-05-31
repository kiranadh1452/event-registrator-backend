import { Request, Response, NextFunction } from "express";
import {
    sendErrorResponse,
    sendSuccessResponse,
} from "./helpers/responseHandler";

import Ticket from "./model";

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
        return sendErrorResponse(res, 501, "Not implemented");
    } catch (error: any) {
        return sendErrorResponse(res, 500, "Internal Server Error");
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
