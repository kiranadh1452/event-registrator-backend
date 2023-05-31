// get env vars before anything else
import * as dotenv from "dotenv";
dotenv.config({
    path: "./src/config/config.env",
});

import tape from "tape";
import axios from "axios";
import { app } from "../../app.js";
import generateToken from "../users/firebaseTokenFetcher.js";

// JSON Data
import eventDataJSON from "../events/staticData/event.json";
import customerDataJSON from "../users/staticData/newCustomer.json";

let createdEvent: any = {};
let createdUser: any = {};

const PORT = app.get("port");
const baseUrl = `http://localhost:${PORT}`;

// helpers methods
const helpers = {
    createUser: async (userData: any) => {
        console.log("Trying to create a new user");

        // create a new user first
        const userResponse = await axios.post(
            `${baseUrl}/api/v1/users/`,
            userData
        );

        console.log("User created successfully");

        return userResponse;
    },
    deleteUser: async (id: string, token: string) => {
        const url: string = `${baseUrl}/api/v1/users/${id}`;

        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
    createEvent: async (eventData: any, token: string) => {
        const url = `${baseUrl}/api/v1/events/`;

        const response = await axios.post(url, eventData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    },
};

export const ticketTestEndpoint = () => {
    tape("Check for the ticket test endpoint", async (t) => {
        const url = `${baseUrl}/api/v1/tickets/test`;

        try {
            const response = await axios.get(url);

            t.equal(response.status, 200, "Status code should be 200");
            t.equal(
                response.data.message,
                "Success",
                "Message should be 'Success'"
            );

            t.end();
        } catch (error) {
            console.log(error);
        }
    });
};

export const createNewTicket = (
    userData: any = customerDataJSON.origin_3,
    eventData: any = eventDataJSON.origin_2
) => {
    tape("Check for new event type creation", async (t) => {
        const url = `${baseUrl}/api/v1/tickets/`;

        try {
            // create a new user first
            const userResponse = await helpers.createUser(userData);
            createdUser.id = await userResponse.data.data._id;

            const { idToken } = await generateToken(
                userData.email,
                userData.password
            );
            createdUser.token = idToken;

            // create a new event
            const eventResponse = await helpers.createEvent(
                eventData,
                createdUser.token
            );
            createdEvent.id = eventResponse.data.data._id;

            // formulate the ticket body
            const ticketBody = {
                eventId: createdEvent.id,
            };

            const response = await axios.post(url, ticketBody, {
                headers: {
                    Authorization: `Bearer ${createdUser.token}`,
                },
            });

            t.equal(response.status, 201, "Status code should be 201");
            t.equal(
                response.data.message,
                "Dummy Ticket created successfully for test",
                "Message should be 'Dummy Ticket created successfully for test'"
            );

            t.equal(
                response.data.data.eventId,
                createdEvent.id,
                "Event id should be the same"
            );
            t.equal(
                response.data.data.userId,
                createdUser.id,
                "User id should be the same as the user who created the ticket"
            );

            t.end();
        } catch (error: any) {
            console.log(error.response?.data);
            t.error(error);
        }
    });
};

const clearUserData = () => {
    tape("Deleting the user data first", async (t) => {
        await helpers.deleteUser(createdUser.id, createdUser.token);
    });
};

const runTests = () => {
    ticketTestEndpoint();
    createNewTicket();
    clearUserData();
};

export default runTests;
