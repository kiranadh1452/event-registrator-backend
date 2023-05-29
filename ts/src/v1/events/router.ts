import express, { Request, Response, Router } from "express";

// import router specific config
import {
    AllFieldsInEvent,
    EventQueryFields,
    EventCreationRequirements,
} from "./helpers/dataFields.js";

import {
    userAuthenticatorForEventsMiddleware,
    isCurrentUserEventOrganizer,
} from "./middleware";

// import global - data validation middlewares
import {
    sanitizeData,
    dataFormatValidation,
    validationResultHandler,
    nonEmptyValidation,
    nonEmptyPlusDataValidation,
} from "../validation-middlewares/dataFormatValidation.js";

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
EventRouter.get(
    "/",
    sanitizeData(EventQueryFields),
    dataFormatValidation(EventQueryFields),
    validationResultHandler,
    getAllEventsController
);

// POST a new event
EventRouter.post(
    "/",
    sanitizeData(AllFieldsInEvent), // sanitize all fields provided
    dataFormatValidation(AllFieldsInEvent), // validate all fields provided
    nonEmptyValidation(EventCreationRequirements), // check that all required fields are provided
    validationResultHandler,
    createEventController
);

// GET a specific event by ID
EventRouter.get(
    "/:id",
    sanitizeData(["id"]),
    nonEmptyPlusDataValidation(["id"]),
    validationResultHandler,
    getEventByIdController
);

// PUT update an existing event by ID
EventRouter.put(
    "/:id",
    sanitizeData(AllFieldsInEvent),
    isCurrentUserEventOrganizer,
    nonEmptyPlusDataValidation(["id"]),
    dataFormatValidation(AllFieldsInEvent),
    validationResultHandler,
    updateEventByIdController
);

// DELETE an existing event by ID
EventRouter.delete(
    "/:id",
    isCurrentUserEventOrganizer,
    (req: Request, res: Response) => {
        return res.status(403).json({
            code: 403,
            message: "Currently, deleting an event is forbidden",
        });
    },
    deleteEventByIdController // this part is unreachable for now
);

export default EventRouter;
