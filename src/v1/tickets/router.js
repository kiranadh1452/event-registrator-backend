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

ticketRouter.use(userAuthenticatorForTicketsMiddleware);
// GET all tickets
ticketRouter.get("/", ticketController.getTicketsController);

// POST a new ticket
ticketRouter.post("/", ticketController.createTicketController);

// GET a specific ticket
ticketRouter.get("/:id", ticketController.getTicketByIdController);

// PUT update an existing ticket
// What could be the use of letting the ticket to be edited by user?

// DELETE a ticket
ticketRouter.delete("/:id", ticketController.deleteTicketController);

export default ticketRouter;
