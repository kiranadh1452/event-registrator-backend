import { IEvent } from "./types";
import { EventEmitter } from "events";
import { createNewProductAndPrice } from "../../stripe-handler/stripeHandler";

const EventEvents = new EventEmitter();

/**
 * @Event_Handlers_on_the_Event_Model
 */

EventEvents.on("event.created", async (event: IEvent) => {
    console.log("Event created event received");
    console.log("Event data: ", event);

    if (process.env.MODE?.toLocaleLowerCase() !== "dev") {
        // let's use the format `ORG_organizerId_EID_eventId_CRTD_createdAt` to create a product id
        const productId = `ORG_${event.organizerId.toString()}_EID_${event._id.toString()}_CRTD_${event.created_at.valueOf()}`;

        const product = await createNewProductAndPrice(
            productId,
            event._id,
            event.name,
            event.price
        );
        console.log("Product created in stripe: ", product);

        // store priceId and productId from the product to mongo
        event.priceId = product.priceId;
        event.productId = product.productId;
        event.oldPriceIds.push(product.priceId);

        await event.save();
    } else {
        console.log("Product not created in stripe for dev mode");
    }
});

export default EventEvents;
