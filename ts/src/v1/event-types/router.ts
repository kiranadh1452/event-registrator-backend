import express, { Request, Response, Router } from "express";

// import event type middleware
import * as eventTypesMiddleware from "./middleware";

// import event type controller
import * as eventTypesController from "./controller";

// import data fields for event type
import * as DataFields from "./helpers/dataFields";

// import global validation middlewares
import {
    sanitizeData,
    dataFormatValidation,
    validationResultHandler,
    nonEmptyValidation,
    nonEmptyPlusDataValidation,
} from "../validation-middlewares/dataFormatValidation.js";

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
EventTypeRouter.get(
    "/",
    sanitizeData(DataFields.EventTypeQueryFields),
    dataFormatValidation(DataFields.EventTypeQueryFields),
    validationResultHandler,
    eventTypesController.getAllEventTypesController
);

// Create a new event type
EventTypeRouter.post(
    "/",
    sanitizeData(DataFields.AllFieldsInEventType),
    dataFormatValidation(DataFields.AllFieldsInEventType),
    nonEmptyValidation(DataFields.EventTypeCreationRequirements),
    validationResultHandler,
    eventTypesController.createEventTypeController
);

// Get the details of a specific event type by ID
EventTypeRouter.get(
    "/:id",
    sanitizeData(["id"]),
    nonEmptyPlusDataValidation(["id"]),
    validationResultHandler,
    eventTypesController.getEventTypeByIdController
);

// Update an existing event type by ID
EventTypeRouter.put(
    "/:id",
    sanitizeData(["id", ...DataFields.AllFieldsInEventType]),
    nonEmptyPlusDataValidation(["id"]),
    dataFormatValidation(DataFields.AllFieldsInEventType),
    validationResultHandler,
    eventTypesController.updateEventTypeByIdController
);

// Delete an event type by ID
EventTypeRouter.delete(
    "/:id",
    (req: Request, res: Response) => {
        return res.status(403).json({
            code: 403,
            message: "Currently, deleting an event-type is forbidden",
        });
    },
    eventTypesController.deleteEventTypeByIdController
);

export default EventTypeRouter;
