import express, { Request, Response, Router } from "express";

// import event type middleware
import * as eventTypesMiddleware from "./middleware";

// import event type controller
import * as eventTypesController from "./controller";

const EventTypeRouter: Router = express.Router();

// This is a test endpoint
EventTypeRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Event Types",
    });
});

// For all routes below this, the user must be authenticated
EventTypeRouter.use(
    eventTypesMiddleware.userAuthenticatorForEventTypesMiddleware
);

// Get a list of all event types
EventTypeRouter.get("/", eventTypesController.getAllEventTypesController);

// Create a new event type
EventTypeRouter.post("/", eventTypesController.createEventTypeController);

// Get the details of a specific event type by ID
EventTypeRouter.get("/:id", eventTypesController.getEventTypeByIdController);

// Update an existing event type by ID
EventTypeRouter.put("/:id", eventTypesController.updateEventTypeByIdController);

// Delete an event type by ID
EventTypeRouter.delete(
    "/:id",
    eventTypesController.deleteEventTypeByIdController
);

export default EventTypeRouter;
