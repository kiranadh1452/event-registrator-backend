import crypto from "crypto";
import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config({
    path: "./src/config/config.env",
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * description: create a customer
 * @param {string} email - email of the customer
 * @param {string} id - id of the customer
 * @returns {object} customer
 */
export const addNewCustomer = async (id, email) => {
    try {
        const customer = await stripe.customers.create({
            id,
            email,
        });

        return customer;
    } catch (error) {
        throw new Error(
            `Error while creating customer with id '${id}' : ${error.message}`
        );
    }
};

/**
 * description: retrieve a customer
 * @param {string} id - id of the customer
 * @returns {object} customer
 */
export const getCustomerById = async (id) => {
    try {
        const customer = await stripe.customers.retrieve(id);
        return customer;
    } catch (error) {
        throw new Error(
            `Error while retrieving customer '${id}' : ${error.message}`
        );
    }
};

/**
 * description: create a new product
 * @param {string} name - name of the product
 * @param {string} description - description of the product
 * @returns {object} product
 */
export const createNewProduct = async (id, name, description) => {
    try {
        const product = await stripe.products.create({
            id,
            name,
            description,
        });

        return product;
    } catch (error) {
        throw new Error(
            `Error while creating product '${name}' : ${error.message}`
        );
    }
};

/**
 * description: create a new price
 * @param {string} productId - id of the product
 * @param {number} unitAmount - unit amount of the price
 * @param {string} currency - currency of the price
 * @returns {object} price
 */
export const createNewPrice = async (
    productId,
    unitAmount,
    currency = "usd"
) => {
    try {
        const price = await stripe.prices.create({
            product: productId,
            unit_amount: unitAmount,
            currency,
        });

        return price;
    } catch (error) {
        throw new Error(`Error while creating price, ${error.message}`);
    }
};

/**
 * description: create a new payment link
 * @param {string} priceId - id of the price
 * @param {number} quantity - quantity of the price
 * @returns {object} paymentLink
 */
export const createNewPaymentLink = async (priceId, quantity = 1) => {
    try {
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: priceId,
                    quantity,
                },
            ],
        });

        return paymentLink;
    } catch (error) {
        throw new Error(`Error while creating payment link, ${error.message}`);
    }
};

/**
 * description: create a new checkout session
 * @param {string} priceId - id of the price
 * @param {number} quantity - quantity of the price
 * @returns {object} session object
 */
export const createNewCheckoutSession = async (
    priceId,
    customerId,
    quantity = 1
) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity,
                },
            ],
            customer: customerId,
            success_url: process.env.SUCCESS_URL_PAYMENT,
            mode: "payment",
            metadata: {
                customerId,
                priceId,
            },
        });

        return session;
    } catch (error) {
        throw new Error(
            `Error while creating checkout session, ${error.message}`
        );
    }
};

/**
 * description: create a new product and price for that product | Here, product is the event
 * @param {string} eventName - name of the event
 * @param {string} eventDescription - description of the event
 * @param {number} eventPrice - price of the event
 */
export const createNewProductAndPrice = async (
    eventName,
    eventDescription,
    eventPrice
) => {
    try {
        // stripe calculates price in cents
        eventPrice = eventPrice * 100;

        let price = null;
        let product = null;
        let newlyCreatedProduct = true;

        const productId = crypto
            .createHash("sha256")
            .update(eventName)
            .digest("hex");

        // search if there is a product, else create a new one
        try {
            product = await stripe.products.retrieve(productId);
            newlyCreatedProduct = false;
        } catch (error) {
            product = await createNewProduct(
                productId,
                eventName,
                eventDescription
            );
        }

        if (newlyCreatedProduct) {
            // create a price for the product
            price = await createNewPrice(product.id, eventPrice);
        } else {
            // search if there is a price for the product
            const prices = await stripe.prices.list({
                limit: 1,
                product: product.id,
            });

            // if there is a price for the product, use it || else create a new one
            if (prices.data.length > 0) {
                price = prices.data[0];
            } else {
                // create a price for the product
                price = await createNewPrice(product.id, eventPrice);
            }
        }

        return {
            priceId: price.id,
            productId: product.id,
        };
    } catch (error) {
        throw new Error(
            `Error while generating product in Stripe for event ${eventName} : ${error.message}`
        );
    }
};

export const generateCheckoutSessionForEvent = async (
    customerId,
    eventName,
    eventDescription,
    eventPrice
) => {
    try {
        let price = null;
        let product = null;
        let newlyCreatedProduct = true;

        const productId = crypto
            .createHash("sha256")
            .update(eventName)
            .digest("hex");

        // search if there is a product, else create a new one
        try {
            product = await stripe.products.retrieve(productId);
            newlyCreatedProduct = false;
        } catch (error) {
            product = await createNewProduct(
                productId,
                eventName,
                eventDescription
            );
        }

        if (newlyCreatedProduct) {
            // create a price for the product
            price = await createNewPrice(product.id, eventPrice);
        } else {
            // search if there is a price for the product
            const prices = await stripe.prices.list({
                limit: 1,
                product: product.id,
            });

            // if there is a price for the product, use it || else create a new one
            if (prices.data.length > 0) {
                price = prices.data[0];
            } else {
                // create a price for the product
                price = await createNewPrice(product.id, eventPrice);
            }
        }

        const checkoutSession = await createNewCheckoutSession(
            price.id,
            customerId
        );

        return {
            priceId: price.id,
            productId: product.id,
            sessionUrl: checkoutSession.url,
        };
    } catch (error) {
        throw new Error(
            `Error while generating payment link for event '${eventName}' : ${error.message}`
        );
    }
};

/**
 * description: create an event hook
 * @param {object} rawBody - raw body of the request
 * @param {string} signature - signature of the request
 * @returns {object} event
 */
export const createWebhook = async (rawBody, signature) => {
    try {
        const event = await stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        return event;
    } catch (error) {
        console.log(error);
        throw new Error(`Error while creating webhook, ${error.message}`);
    }
};
