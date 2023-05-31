import express, { Request, Response, Router } from "express";

// import the middleware here
import * as ticketMiddleware from "./middleware";

// import data fields for ticket
import * as DataFields from "./helpers/dataFields";

// import the controller here
import * as ticketController from "./controller";

// import the global middleware here
// import global validation middlewares
import {
    sanitizeData,
    dataFormatValidation,
    validationResultHandler,
    nonEmptyValidation,
    nonEmptyPlusDataValidation,
} from "../validation-middlewares/dataFormatValidation.js";

const TicketRouter: Router = express.Router();

// This is a test endpoint
TicketRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Tickets",
    });
});

// TODO: Add sanitization and data validation middlewares

TicketRouter.use(ticketMiddleware.userAuthenticatorForTicketsMiddleware);

// GET all tickets
TicketRouter.get(
    "/",
    ticketMiddleware.isRequestingUserAllowedToQuery,
    // user can either query across all the tickets they issues, or all the tickets for events they are oraganizer of
    sanitizeData(DataFields.TicketQueryFields),
    dataFormatValidation(DataFields.TicketQueryFields),
    validationResultHandler,
    ticketController.getTicketsController
);

// POST a new ticket
TicketRouter.post(
    "/",
    sanitizeData(DataFields.TicketCreationRequirements),
    nonEmptyPlusDataValidation(DataFields.TicketCreationRequirements),
    validationResultHandler,
    ticketController.createTicketController
);

// GET a specific ticket
TicketRouter.get(
    "/:id",
    sanitizeData(["id"]),
    nonEmptyPlusDataValidation(["id"]),
    validationResultHandler,
    ticketController.getTicketByIdController
);

export default TicketRouter;
