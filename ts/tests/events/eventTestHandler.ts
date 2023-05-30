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
import eventDataJSON from "./staticData/event.json";
import customerDataJSON from "../users/staticData/newCustomer.json";

let createdEvent: any = {};
let createdUser: any = {};

const PORT = app.get("port");
const baseUrl = `http://localhost:${PORT}`;

export const deleteUser = async (id: string, token: string) => {
    const url: string = `${baseUrl}/api/v1/users/${id}`;

    const response = await axios.delete(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const eventTestEndpoint = () => {
    tape("Check for the event test endpoint", async (t) => {
        const url = `${baseUrl}/api/v1/events/test`;

        try {
            const response = await axios.get(url);

            t.equal(response.status, 200, "Status code should be 200");
            t.equal(
                response.data.message,
                "Success",
                "Message should be 'Success'"
            );
            t.equal(response.data.data, "Test endpoint - Events");

            t.end();
        } catch (error: any) {
            t.error(error);
        }
    });
};

export const eventCreationTest = (
    userData: any,
    newEvent: any = eventDataJSON.origin
) => {
    tape("Check for new event creation", async (t) => {
        const url = `${baseUrl}/api/v1/events/`;

        try {
            // create a new user first
            const userResponse = await axios.post(
                `${baseUrl}/api/v1/users/`,
                userData
            );
            createdUser.id = userResponse.data.data._id;

            // get the token for the user
            const { idToken } = await generateToken(
                userData.email,
                userData.password
            );
            createdUser.token = idToken;

            const response = await axios.post(url, newEvent, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            t.equal(response.status, 201, "Status code should be 201");
            t.equal(
                response.data.message,
                "Event created successfully",
                "Message should be 'Event created successfully'"
            );

            const responseData = response.data.data;
            createdEvent = { ...responseData };

            const timeFields = ["startTime", "endTime"];

            // for all the fields in newEvent, check if they are equal to the response data
            Object.keys(newEvent).forEach((key) => {
                if (timeFields.includes(key)) {
                    t.equal(
                        new Date(newEvent[key]).getTime(),
                        new Date(responseData[key]).getTime(),
                        `${key} should be equal`
                    );
                } else {
                    t.equal(
                        newEvent[key],
                        responseData[key],
                        `${key} should be equal`
                    );
                }
            });

            t.end();
        } catch (error: any) {
            console.error("Failed at event creation test");
            console.log(error);

            t.error(error);
        }
    });
};

export const getAllEvents = () => {
    tape("Check for events fetch based on query params", async (t) => {
        const url = `${baseUrl}/api/v1/events/`;

        try {
            const queryParams = {
                location_search: createdEvent?.location,
                search: createdEvent?.name,
                minPrice: createdEvent?.price - 1,
                maxPrice: createdEvent?.price + 1,
            };

            const response = await axios.get(url, {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${createdUser.token}`,
                },
            });

            t.equal(response.status, 200, "Status code should be 200");
            t.equal(
                response.data.message,
                "Success",
                "Message should be 'Success'"
            );

            const responseData = response.data.data;

            // responseData should be an array
            t.equal(
                Array.isArray(responseData),
                true,
                "Response data should be an array"
            );

            // responseData should have atleast length 1
            t.equal(
                responseData.length >= 1,
                true,
                "Response data should have atleast length 1"
            );

            // check if the response data has the created event
            const createdEventInResponse = responseData.find(
                (event: any) => event._id === createdEvent._id
            );

            // for all the fields present in both createdEvent and createdEventInResponse, check if they are equal
            Object.keys(createdEvent).forEach((key) => {
                if (
                    createdEventInResponse[key] &&
                    typeof createdEventInResponse[key] !== "object"
                ) {
                    t.equal(
                        createdEvent[key],
                        createdEventInResponse[key],
                        `${key} should be equal`
                    );
                }
            });

            t.end();
        } catch (error: any) {
            t.error(error);
        }
    });
};

export const getParticularEventById = () => {
    tape("Check for event fetch based on id", async (t) => {
        console.log(
            "Starting test for particular event fetch by id :",
            createdEvent._id
        );

        const url = `${baseUrl}/api/v1/events/${createdEvent._id}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${createdUser.token}`,
                },
            });

            t.equal(response.status, 200, "Status code should be 200");
            t.equal(
                response.data.message,
                "Success",
                "Message should be 'Success'"
            );

            const responseData = response.data.data;

            // for all the fields present in both createdEvent and responseData, check if they are equal
            Object.keys(createdEvent).forEach((key) => {
                if (
                    responseData[key] &&
                    typeof responseData[key] !== "object"
                ) {
                    t.equal(
                        createdEvent[key],
                        responseData[key],
                        `${key} should be equal`
                    );
                }
            });

            t.end();
        } catch (error: any) {
            t.error(error);
        }
    });
};

export const updateEvent = (updateData: any) => {
    tape("Check for event update", async (t) => {
        console.log("Starting test for event update by id :", createdEvent._id);
        const url = `${baseUrl}/api/v1/events/${createdEvent._id}`;

        try {
            const response = await axios.put(url, updateData, {
                headers: {
                    Authorization: `Bearer ${createdUser.token}`,
                },
            });

            t.equal(response.status, 200, "Status code should be 200");
            t.equal(
                response.data.message,
                "Event updated successfully",
                "Message should be 'Event updated successfully'"
            );

            const responseData = response.data.data;

            // for all the fields present in both updateData and responseData, check if they are equal
            Object.keys(updateData).forEach((key) => {
                if (
                    responseData[key] &&
                    typeof responseData[key] !== "object"
                ) {
                    t.equal(
                        updateData[key],
                        responseData[key],
                        `${key} should be equal`
                    );
                }
            });

            t.end();
        } catch (error: any) {
            t.error(error);
        }
    });
};

const clearUserData = () => {
    tape("Deleting the user data first", async (t) => {
        await deleteUser(createdUser.id, createdUser.token);
    });
};

const runEventTests = async () => {
    eventTestEndpoint();
    eventCreationTest(customerDataJSON.origin_2);
    getAllEvents();
    getParticularEventById();
    updateEvent(eventDataJSON.update);
    clearUserData();
};

export default runEventTests;
