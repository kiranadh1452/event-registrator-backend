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
 * @param {string} id - id of the product to be created
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
 * description: create a new checkout session
 * @param {string} priceId - id of the price
 * @param {string} customerId - id of the customer
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
    productIdToBeUsed,
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

        const productId = productIdToBeUsed;

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

                // if the object is empty or the price is not equal to the event price, create a new price
                if (!price || price.unit_amount !== eventPrice) {
                    price = await createNewPrice(product.id, eventPrice);
                }
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

/**
 * description: This function is used to filter the data from the checkout session object
 * @param {object} checkoutSessionObj - checkout session object
 * @returns {object} desired data from the checkout session object
 */
export const getDesiredDataFromCheckoutSession = (checkoutSessionObj) => {
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
            url,
        } = checkoutSessionObj;

        // extracting the desired data from the checkout session object
        const { email, name } = customer_details;
        const { customerId, priceId } = metadata;
        const { amount_shipping, amount_discount, amount_tax } = total_details;

        return {
            priceId,
            status,
            sessionId: id,
            session_url: url,
            total_amount: amount_total,
            session_created: new Date(created * 1000),
            currency,
            userId: customer || customerId,
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
