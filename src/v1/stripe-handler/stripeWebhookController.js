import {
    createWebhook,
    getDesiredDataFromCheckoutSession,
} from "./stripeHandler.js";

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

            case "checkout.session.completed":
                const session = event.data.object;

                // get the formatted data from the checkout session object
                const desiredData = getDesiredDataFromCheckoutSession(session);

                // TODO: save the data to the database

                break;

            case "checkout.session.async_payment_failed":
                const sessionFailed = event.data.object;
                // what to do on checkout-session failure

                break;

            case "checkout.session.expired":
                const sessionExpired = event.data.object;

                // get the formatted data from the checkout session object
                const desiredDataExpired =
                    getDesiredDataFromCheckoutSession(sessionExpired);

                // TODO: delete the session data from the database

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
