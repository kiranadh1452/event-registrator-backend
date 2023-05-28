import tape from "tape";
import axios from "axios";
import { app, closeDB, connectDB } from "../app.js";

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

tape("Check for the user test endpoint", async (t) => {
    const url = `${baseUrl}/api/v1/users/test`;

    try {
        const response = await axios.get(url);

        t.equal(response.status, 200, "Status code should be 200");
        t.equal(
            response.data.message,
            "Success",
            "Message should be 'success'"
        );
        t.equal(response.data.data, "Test endpoint - Users");

        t.end();
    } catch (error: any) {
        t.error(error);
    }
});

tape("Clean up", async (t) => {
    await closeDB();
    server.close();
});
