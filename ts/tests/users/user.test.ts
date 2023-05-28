// get env vars before anything else
import * as dotenv from "dotenv";
dotenv.config({
    path: "./src/config/config.env",
});

import tape from "tape";
import axios from "axios";
import generateToken from "./firebaseTokenFetcher.js";
import { app, closeDB, connectDB } from "../../app.js";
import customerDataJSON from "./staticData/newCustomer.json";

let createdCustomer: any;
let customerToken: string;
const newCustomer = customerDataJSON.origin;
const dataToUpdate = customerDataJSON.updates;

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

// test customer creation part
tape("Check for new customer creation", async (t) => {
    const url = `${baseUrl}/api/v1/users/`;

    try {
        const response = await axios.post(url, newCustomer);

        t.equal(response.status, 201, "Status code should be 201");
        t.equal(
            response.data.message,
            "User created successfully",
            "Message should be 'User created successfully'"
        );

        const responseData = response.data.data;
        createdCustomer = { ...responseData };

        // Compare common fields
        const commonFields = [
            "email",
            "firstName",
            "lastName",
            "phoneNumber",
            "country",
            "address",
            "zipCode",
        ];
        for (const field of commonFields) {
            t.equal(
                (newCustomer as any)[field],
                responseData[field],
                `Values for '${field}' should be equal`
            );
        }

        // const created_at = responseData.created_at;
        const timeDiffereneBetweenNowAndCreatedAt =
            (new Date().valueOf() -
                new Date(responseData.created_at).valueOf()) /
            1000;

        t.ok(
            timeDiffereneBetweenNowAndCreatedAt < 20,
            'Time difference between "created_at" and now should be less than 20 seconds'
        );

        t.end();
    } catch (error: any) {
        console.log(error);

        t.error(error);
    }
});

// test if we can get the id token using firebase
tape("Check for getting id token", async (t) => {
    try {
        const { email, password } = newCustomer;
        const response = await generateToken(email, password);
        t.ok(response.idToken, "idToken should be present");
        customerToken = response.idToken;
        t.end();
    } catch (error: any) {
        t.error(error);
        console.log("Can't process further tests for user without id token");
        process.exit(1);
    }
});

// test customer update part
tape("Check for updating customer", async (t) => {
    const url = `${baseUrl}/api/v1/users/${createdCustomer._id}`;

    try {
        const response = await axios.put(url, dataToUpdate, {
            headers: {
                Authorization: `Bearer ${customerToken}`,
            },
        });

        t.equal(response.status, 200, "Status code should be 200");
        t.equal(
            response.data.message,
            "User updated successfully",
            "Message should be 'User updated successfully'"
        );

        const responseData = response.data.data;

        // compare those fields which were updated
        const updatedFields = Object.keys(dataToUpdate);
        for (const field of updatedFields) {
            t.equal(
                (dataToUpdate as any)[field],
                responseData[field],
                `Values for '${field}' should be equal`
            );
        }

        // get the unchanged fields and compare them
        const remainingFields = Object.keys(createdCustomer).filter(
            (field) => !updatedFields.includes(field)
        );
        for (const field of remainingFields) {
            if (field === "updated_at") continue;
            t.equal(
                (createdCustomer as any)[field],
                responseData[field],
                `Values for '${field}' should be equal`
            );
        }
    } catch (error) {
        t.error(error);
    }
});

// test customer deletion part
tape("Check for deleting customer", async (t) => {
    const url = `${baseUrl}/api/v1/users/${createdCustomer._id}`;

    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${customerToken}`,
            },
        });

        t.equal(response.status, 200, "Status code should be 200");
        t.equal(
            response.data.message,
            "User deleted successfully",
            "Message should be 'User deleted successfully'"
        );
    } catch (error) {}
});

tape("Clean up", async (t) => {
    await closeDB();
    server.close();
});
