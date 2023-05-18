import { IUser } from "./types";
import { EventEmitter } from "events";
import { deleteUser } from "./firebaseHandler";

// create an event emitter for the user model
export const UserEvents = new EventEmitter();

/**
 * Events Handlers on the User Model
 */
UserEvents.on("user.created", async (user: IUser) => {
    console.log("User created event received");
    console.log("User data: ", user);

    // this would be these steps:
    // 1. Create the customer in stripe
    // 2. Send a welcome text message
    // 3. Send a welcome email
});

UserEvents.on("user.deleted", async (uid: string) => {
    console.log("User deleted event received");
    await deleteUser(uid);
});
