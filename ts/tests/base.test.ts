// get env vars before anything else
import * as dotenv from "dotenv";
dotenv.config({
    path: "./src/config/config.env",
});

import tape from "tape";
import axios from "axios";

import { app, closeDB, connectDB } from "../app.js";
import RunAllUserTests from "./users/userTestHandler.js";

const PORT = app.get("port");
const baseUrl = `http://localhost:${PORT}`;

// starting the server
const server = app.listen(app.get("port"), () => {
    console.log(`App listening on port ${app.get("port")}`);
});

tape("Set up database", async (t) => {
    await connectDB();
});

tape("Check for the server base test endpoint", async (t) => {
    const url = `${baseUrl}/test`;

    try {
        const response = await axios.get(url);

        t.equal(response.status, 200, "Status code should be 200");
        t.equal(response.data.success, true, "Success should be true");
        t.equal(response.data.message, "Express app is working");

        t.end();
    } catch (error: any) {
        t.error(error);
    }
});

// Run all user tests
RunAllUserTests();

tape("Clean up", async (t) => {
    await closeDB();
    server.close();
});
