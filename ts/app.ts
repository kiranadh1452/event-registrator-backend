// import the required packages
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import express, { Express, Request, Response, NextFunction } from "express";

// import database connection
import connectDB from "./src/config/db.js";

// import the routes
import UserRouter from "./src/v1/users/router.js";
import EventRouter from "./src/v1/events/router.js";
import TicketRouter from "./src/v1/tickets/router.js";
import EventTypeRouter from "./src/v1/event-types/router.js";

// set up dotenv, to allow us to use environment variables
dotenv.config({
    path: "./src/config/config.env",
});

// connect to the database
connectDB();

// creating and configuring the app
const port = process.env.PORT || 8000;
const app: Express = express();

app.set("port", port);
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

// starting the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
