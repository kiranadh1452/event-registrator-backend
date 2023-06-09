import { IUser } from "./types";
import { EventEmitter } from "events";
import { deleteUser } from "./firebaseHandler";
import {
    addNewCustomer,
    deleteCustomer,
} from "../../stripe-handler/stripeHandler";

// create an event emitter for the user model
export const UserEvents = new EventEmitter();

/**
 * Events Handlers on the User Model
 */
UserEvents.on("user.created", async (user: IUser) => {
    console.log("User created event received");
    console.log("User data: ", user);

    // this would be these steps:

    // 1. Create the customer in stripe : DONE
    // creating a customer in stripe
    if (process.env.MODE?.toLocaleLowerCase() !== "dev") {
        // TODO: If customer creation in stripe fails, retry it (maybe later, we can shift this to a pub-sub model)
        const customer = await addNewCustomer(user._id, user.email);
        console.log("Customer created in stripe: ", customer);
    } else {
        console.log("Skipping creating customer in stripe for dev mode");
    }

    // 2. Send a welcome email
});

UserEvents.on("user.deleted", async (uid: string) => {
    console.log("User deleted event received");
    await deleteUser(uid);

    // delete customer in stripe
    if (process.env.MODE?.toLocaleLowerCase() !== "dev") {
        await deleteCustomer(uid);
    }
});
