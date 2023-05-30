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
import eventTypeDataJSON from "./staticData/newEventType.json";
import customerDataJSON from "../users/staticData/newCustomer.json";

let createdEventType: any = {};
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
};

export const eventTypeTestEndpoint = () => {
    tape("Check for the event type test endpoint", async (t) => {
        const url = `${baseUrl}/api/v1/event-types/test`;

        try {
            const response = await axios.get(url);

            t.equal(response.status, 200, "Status code should be 200");
            t.equal(
                response.data.message,
                "Success",
                "Message should be 'Success'"
            );
            t.equal(response.data.data, "Test endpoint - Event Types");

            t.end();
        } catch (error: any) {
            t.error(error);
        }
    });
};

export const createNewEventTypeTest = (
    eventTypeData: any = eventTypeDataJSON.origin,
    userData: any = customerDataJSON.origin_3
) => {
    tape("Check for new event type creation", async (t) => {
        const url = `${baseUrl}/api/v1/event-types/`;

        try {
            // create a new user first
            const userResponse = await helpers.createUser(userData);
            createdUser.id = await userResponse.data.data._id;

            const { idToken } = await generateToken(
                userData.email,
                userData.password
            );
            createdUser.token = idToken;
            console.log(idToken);

            // create a new event type
            const response = await axios.post(url, eventTypeData, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            createdEventType = response.data.data;

            t.equal(response.status, 201, "Status code should be 201");
            t.equal(
                response.data.message,
                "Success",
                "Message should be 'Success'"
            );
            t.equal(
                response.data.data.name,
                eventTypeData.name,
                "Event type name should be the same"
            );
            t.equal(
                response.data.data.description,
                eventTypeData.description,
                "Event type description should be the same"
            );

            t.end();
        } catch (error: any) {
            console.log(error.response.data);

            t.error(error);
        }
    });
};

export const getAllEventTypes = () => {
    tape("Check for all event types", async (t) => {
        const url = `${baseUrl}/api/v1/event-types/`;

        try {
            const queryParams = {
                search: createdEventType.name,
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

            // check if the response data has the created event type
            const foundEventType = responseData.find(
                (eventType: any) => eventType._id === createdEventType._id
            );

            // for all the fields present in both createdEventType and foundEventType
            // check if the values are same
            Object.keys(createdEventType).forEach((key) => {
                if (
                    foundEventType[key] &&
                    typeof foundEventType[key] !== "object"
                ) {
                    t.equal(
                        foundEventType[key],
                        createdEventType[key],
                        `${key} should be the same`
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
    tape("Check for particular event type", async (t) => {
        const url = `${baseUrl}/api/v1/event-types/${createdEventType._id}`;

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

            // responseData should be an object
            t.equal(
                typeof responseData === "object",
                true,
                "Response data should be an object"
            );

            // for all the fields present in both createdEventType and responseData
            // check if the values are same
            Object.keys(createdEventType).forEach((key) => {
                if (
                    responseData[key] &&
                    typeof responseData[key] !== "object"
                ) {
                    t.equal(
                        responseData[key],
                        createdEventType[key],
                        `${key} should be the same`
                    );
                }
            });

            t.end();
        } catch (error: any) {
            t.error(error);
        }
    });
};

export const updateEventType = (
    dataToUpdate: any = eventTypeDataJSON.origin_updated
) => {
    tape("Check for updating an event type", async (t) => {
        console.log("Checking now for updating an event type");

        const url = `${baseUrl}/api/v1/event-types/${createdEventType._id}`;

        try {
            const response = await axios.put(url, dataToUpdate, {
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

            // responseData should be an object
            t.equal(
                typeof responseData === "object",
                true,
                "Response data should be an object"
            );

            // for all the fields present in dataToUpdate,
            // check if the response values are same
            Object.keys(dataToUpdate).forEach((key) => {
                if (typeof responseData[key] !== "object") {
                    t.equal(
                        responseData[key],
                        dataToUpdate[key],
                        `${key} should be the same`
                    );
                }
            });

            // for remaining fields which are not in dataToUpdate, check if the values in responseData are same to that of original event-type, i.e. createdEventType
            const fieldsToIgnoreOnEventTypeUpdate = [
                ...Object.keys(dataToUpdate),
                "updated_at",
            ];
            Object.keys(createdEventType).forEach((key) => {
                if (
                    !fieldsToIgnoreOnEventTypeUpdate.includes(key) &&
                    typeof responseData[key] !== "object"
                ) {
                    t.equal(
                        responseData[key],
                        createdEventType[key],
                        `${key} should be the same`
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
        await helpers.deleteUser(createdUser.id, createdUser.token);
    });
};

const runEventTypesTest = async () => {
    eventTypeTestEndpoint();
    createNewEventTypeTest();
    getAllEventTypes();
    getParticularEventById();
    updateEventType();
    clearUserData();
};

export default runEventTypesTest;
