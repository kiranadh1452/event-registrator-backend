import * as eventRouter from "./router.js";
import * as eventMiddleware from "./middleware.js";
import * as eventController from "./controller.js";

const EventModule = {
    router: eventRouter,
    middleware: eventMiddleware,
    controller: eventController,
};

export default EventModule;
