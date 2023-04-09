import { createWebhook } from "./stripeHandler.js";

/**
 * description: This function is used to filter the data from the checkout session object
 * @param {object} checkoutSessionObj - checkout session object
 * @returns {object} desiredData - desired data from the checkout session object
 */
const getDesiredDataFromCheckoutSession = (checkoutSessionObj) => {
    try {
        const {
            id,
            amount_total,
            created,
            currency,
            customer,
            customer_email,
            customer_details,
            payment_intent,
            payment_status,
            total_details,
            // line_items,
            metadata,
            status,
        } = checkoutSessionObj;

        // extracting the desired data from the checkout session object
        const { email, name } = customer_details;
        const { customerId, priceId } = metadata;
        const { amount_shipping, amount_discount, amount_tax } = total_details;

        return {
            customerId,
            priceId,
            status,

            sessionId: id,
            total_amount: amount_total,
            session_created: new Date(created * 1000),
            currency,
            userId: customer,
            email: customer_email || email,
            name,
            payment_intent,
            payment_status,
            amount_shipping,
            amount_discount,
            amount_tax,
        };
    } catch (error) {
        console.log("Error in getDesiredDataFromCheckoutSession: ");
        throw error;
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
        }

        // Return a response to acknowledge receipt of the event
        return res.status(200).json({ received: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export default stripeWebhookController;
