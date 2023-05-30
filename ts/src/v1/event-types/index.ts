import EventTypeRouter from "./router";
import EventTypeModel from "./model";
import * as EventTypeController from "./controller";
import * as EventTypeMiddleware from "./middleware";

const EventTypeModule = {
    Router: EventTypeRouter,
    Model: EventTypeModel,
    Controller: EventTypeController,
    Middleware: EventTypeMiddleware,
};

export default EventTypeModule;
