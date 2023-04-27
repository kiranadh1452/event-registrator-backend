import EventType from "./model.js";
import * as eventTypeRouter from "./router.js";
import * as eventTypeMiddleware from "./middleware.js";
import * as eventTypeController from "./controller.js";

const EventTypeModule = {
    dataModel: EventType,
    router: eventTypeRouter,
    middleware: eventTypeMiddleware,
    controller: eventTypeController,
};

export default EventTypeModule;
