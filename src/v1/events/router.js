import express from "express";

// Import middleware here
import {
    userAuthenticatorForEventsMiddleware,
    isCurrentUserEventOrganizer,
} from "./middleware.js";

// Import the event controller here
import * as eventsController from "./controller.js";

const router = express.Router();

// Define the event routes here
router.get("/test", (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Events",
    });
});

router.use(userAuthenticatorForEventsMiddleware);

// GET all events
router.get("/", eventsController.getAllEventsController);

// POST a new event
router.post("/", eventsController.createEventController);

// GET a specific event by ID
router.get("/:id", eventsController.getEventByIdController);

// PUT update an existing event by ID
router.put(
    "/:id",
    isCurrentUserEventOrganizer,
    eventsController.updateEventByIdController
);

// DELETE an existing event by ID
router.delete(
    "/:id",
    isCurrentUserEventOrganizer,
    eventsController.deleteEventByIdController
);

export default router;
