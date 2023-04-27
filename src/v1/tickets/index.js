import Ticket from "./model.js";
import * as ticketRouter from "./router.js";
import * as ticketMiddleware from "./middleware.js";
import * as ticketController from "./controller.js";

const TicketModule = {
    dataModel: Ticket,
    router: ticketRouter,
    middleware: ticketMiddleware,
    controller: ticketController,
};

export default TicketModule;
