import * as eventTypeRouter from "./router.js";
import * as eventTypeMiddleware from "./middleware.js";
import * as eventTypeController from "./controller.js";

const EventTypeModule = {
    router: eventTypeRouter,
    middleware: eventTypeMiddleware,
    controller: eventTypeController,
};

export default EventTypeModule;
