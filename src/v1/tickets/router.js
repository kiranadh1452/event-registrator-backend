import express from "express";

// Import the event controller here
import * as ticketController from "./controller.js";

// Import the middleware here
import { userAuthenticatorForTicketsMiddleware } from "./middleware.js";

const ticketRouter = express.Router();

// Define the event routes here
ticketRouter.get("/test", (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Tickets",
    });
});

// GET all tickets
ticketRouter.get("/tickets", ticketController.getTicketsController);

// POST a new ticket
ticketRouter.post("/tickets", ticketController.createTicketController);

// GET a specific ticket
ticketRouter.get(
    "/tickets/:id",
    userAuthenticatorForTicketsMiddleware,
    ticketController.getTicketByIdController
);

// PUT update an existing ticket
// What could be the use of letting the ticket to be edited by user?
// ticketRouter.put(
//     "/tickets/:id",
//     userAuthenticatorForTicketsMiddleware,
//     ticketController.updateTicketController
// );

// DELETE a ticket
ticketRouter.delete(
    "/tickets/:id",
    userAuthenticatorForTicketsMiddleware,
    ticketController.deleteTicketController
);

export default ticketRouter;
