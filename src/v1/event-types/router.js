import express from "express";

// Import the event type middleware here
import * as eventTypesMiddleware from "./middleware.js";

// Import the event type controller here
import * as eventTypesController from "./controller.js";

const eventTypeRouter = express.Router();

// Define the event routes here
eventTypeRouter.get("/test", (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Event Types",
    });
});

// For all routes below this, the user must be authenticated
eventTypeRouter.use(
    eventTypesMiddleware.userAuthenticatorForEventTypesMiddleware
);

// Get a list of all event types
eventTypeRouter.get("/", eventTypesController.getAllEventTypesController);

// Create a new event type
eventTypeRouter.post("/", eventTypesController.createEventTypeController);

// Get the details of a specific event type by ID
eventTypeRouter.get("/:id", eventTypesController.getEventTypeByIdController);

// Update an existing event type by ID
eventTypeRouter.put("/:id", eventTypesController.updateEventTypeByIdController);

// Delete an event type by ID
eventTypeRouter.delete(
    "/:id",
    eventTypesController.deleteEventTypeByIdController
);

export default eventTypeRouter;
