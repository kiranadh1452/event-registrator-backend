import EventRouter from "./router";
import EventModel from "./model";
import * as EventController from "./controller";
import * as EventMiddleware from "./middleware";

const EventModule = {
    Router: EventRouter,
    Model: EventModel,
    Controller: EventController,
    Middleware: EventMiddleware,
};

export default EventModule;
