import {
    createWebhook,
    getDesiredDataFromCheckoutSession,
} from "./stripeHandler.js";

// importing Ticket model
import Ticket from "../tickets/model.js";

/**
 * description: This function is used by the webhook controller upon completion or expiration of a checkout session to update the ticket
 */
const onSessionCompleteController = async (desiredData) => {
    try {
        const { sessionId, status, payment_status } = desiredData;

        // get the ticket by sessionId
        const ticket = await Ticket.find({ sessionId: sessionId });

        // if the ticket exists, update the ticket with the desired data props
        if (ticket) {
            // if the session is expired and payment status is unpaid, delete the ticket and return true
            if (status == "expired" && payment_status == "unpaid") {
                // delete the ticket
                await Ticket.deleteOne({ sessionId: sessionId });

                return true;
            }

            // update the ticket if the session is completed
            await Ticket.updateOne(
                { sessionId: sessionId },
                {
                    $set: {
                        ...desiredData,
                    },
                }
            );
        }

        return true;
    } catch (error) {
        return false;
    }
};

/**
 * description: this function is used to handle stripe webhook events
 */
const stripeWebhookController = async (req, res) => {
    try {
        const signature = req.headers["stripe-signature"];
        let event;

        let rawBody = req.rawBody || req.body;
        try {
            event = await createWebhook(
                rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );

            // event type
            console.log(`Event type: ${event.type}`);
        } catch (error) {
            console.log(`Could not create webhook due to: ${error.message}`);
            // This response is sent back to Stripe to let there was an error while attempting to create the webhook
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }

        // handling the event
        switch (event.type) {
            case "charge.succeeded":
                const charge = event.data.object;
                // what to do on charge success

                break;

            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                // what to do on payment-intent success

                break;

            case "payment_intent.created":
                const paymentIntentCreated = event.data.object;
            // what to do on payment-intent creation

            case "payment_intent.payment_failed":
                const paymentIntentFailed = event.data.object;
                // what to do on payment-intent failure

                break;

            case "checkout.session.expired":
            case "checkout.session.completed":
            case "checkout.session.async_payment_failed":
                const session = event.data.object;

                // get the formatted data from the checkout session object
                const desiredData = getDesiredDataFromCheckoutSession(session);

                // save the data to the database
                const ticketUpdated = await onSessionCompleteController(
                    desiredData
                );

                // if the ticket is not updated, then return an error
                if (!ticketUpdated) {
                    return res.status(400).send("Error: Ticket not updated");
                }

                break;
        }

        // Return a response to acknowledge receipt of the event
        return res.status(200).json({ received: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export default stripeWebhookController;
