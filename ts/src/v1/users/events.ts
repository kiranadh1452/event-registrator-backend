import { IUser } from "./types";
import { UserEvents } from "./model";

/**
 * Events Handlers on the User Model
 */
UserEvents.on("userCreated", async (user: IUser) => {
    // this would be these steps:
    // 1. Create the customer in stripe
    // 2. Send a welcome text message
    // 3. Send a welcome email
});
