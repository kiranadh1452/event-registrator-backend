// import the required packages
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import RateLimit from "express-rate-limit";
import express, { Express, Request, Response, NextFunction } from "express";

// import database connection
import connectDB, { closeDB } from "./src/config/db.js";

// import the routes
import UserRouter from "./src/v1/users/router.js";
import EventRouter from "./src/v1/events/router.js";
import TicketRouter from "./src/v1/tickets/router.js";
import EventTypeRouter from "./src/v1/event-types/router.js";
import StripeWebhookRouter from "./src/v1/stripe-handler/router.js";

// set up dotenv, to allow us to use environment variables
dotenv.config({
    path: "./src/config/config.env",
});

// creating and configuring the app
const port = process.env.PORT || 8000;
const app: Express = express();

// setting rate limit
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: process.env.MODE !== "dev" ? 10 : 1000,
});

app.use(limiter);
app.set("port", port);

// the webhook requires the raw body to construct the event
app.use(
    "/v1/stripe",
    bodyParser.raw({ type: "application/json" }),
    StripeWebhookRouter
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// match the routes to a particualr endpoint
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/events", EventRouter);
app.use("/api/v1/tickets", TicketRouter);
app.use("/api/v1/event-types", EventTypeRouter);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        success: true,
        message: "Express app is working",
    });
});

// Sample route
app.use("*", (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        success: false,
        message: "API endpoint doesn't exist",
    });
});

export { app, connectDB, closeDB };

// if this file is run directly, start the server
if (require.main === module) {
    // start the server only after the database connection is established
    connectDB().then(() => {
        console.log("Connected to database");

        app.listen(app.get("port"), () => {
            console.log(`App listening on port ${app.get("port")}`);
        });
    });
}
