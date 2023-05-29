import express, { Request, Response, Router } from "express";
import {
    userAuthenticatorForEventsMiddleware,
    isCurrentUserEventOrganizer,
} from "./middleware";
import {
    getAllEventsController,
    createEventController,
    getEventByIdController,
    updateEventByIdController,
    deleteEventByIdController,
} from "./controller";

const EventRouter: Router = express.Router();

// This is a test endpoint
EventRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Events",
    });
});

EventRouter.use(userAuthenticatorForEventsMiddleware);

// GET all events
EventRouter.get("/", getAllEventsController);

// POST a new event
EventRouter.post("/", createEventController);

// GET a specific event by ID
EventRouter.get("/:id", getEventByIdController);

// PUT update an existing event by ID
EventRouter.put("/:id", isCurrentUserEventOrganizer, updateEventByIdController);

// DELETE an existing event by ID
EventRouter.delete(
    "/:id",
    isCurrentUserEventOrganizer,
    deleteEventByIdController
);

export default EventRouter;
