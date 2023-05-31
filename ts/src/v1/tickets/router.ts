import express, { Request, Response, Router } from "express";

// import the middleware here
import * as ticketMiddleware from "./middleware";

// import the controller here
import * as ticketController from "./controller";

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
TicketRouter.get("/", ticketController.getTicketsController);

// POST a new ticket
TicketRouter.post("/", ticketController.createTicketController);

// GET a specific ticket
TicketRouter.get("/:id", ticketController.getTicketByIdController);

export default TicketRouter;
