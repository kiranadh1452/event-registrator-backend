import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";

// import the database connection
import connectDB from "./config/db.js";

// Import routes
import usersRouter from "./v1/users/router.js";
import eventsRouter from "./v1/events/router.js";
import ticketsRouter from "./v1/tickets/router.js";
import eventTypesRouter from "./v1/event-types/router.js";

// configure environment variables
dotenv.config({
    path: "./src/config/config.env",
});
const port = process.env.PORT || 3000;

// database
connectDB();

// creating express app and configuring it
const app = express();
app.set("port", port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use the routers imported
app.use("/v1/users", usersRouter);
app.use("/v1/events", eventsRouter);
app.use("/v1/tickets", ticketsRouter);
app.use("/v1/event-types", eventTypesRouter);

// create a test endpoint
app.get("/test", (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Root test endpoint",
    });
});

//handle other requests with 404 if not handled previously
app.use("*", (req, res, next) => {
    return res.status(404).json({
        error: {
            code: 404,
            message: "Resource not found",
            details: "The requested endpoint does not exist",
        },
    });
});

//server listening, named server as it can be further used. Eg, in peparing socket connection
const server = app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}  - ${Date()}`);
});

export default server;
