import crypto from "crypto";
import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config({
    path: "./src/config/config.env",
});

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY as string,
    {} as Stripe.StripeConfig
);

/**
 * description: create a customer
 * @param {string} email - email of the customer
 * @param {string} id - id of the customer
 * @returns {object} customer
 */
export const addNewCustomer = async (id: string, email: string) => {
    try {
        const customer = await stripe.customers.create({
            // @ts-ignore
            id, // ts does not support providing custom id, so we have to ignore the error here
            email,
        });

        return customer;
    } catch (error: any) {
        throw new Error(
            `Error while creating customer with id '${id}' : ${error.message}`
        );
    }
};

/**
 * description: get a customer
 * @param {string} id - stripe id of the customer to be fetched
 * @returns {object} customer
 */
export const getCustomer = async (id: string) => {
    try {
        const customer = await stripe.customers.retrieve(id);

        return customer;
    } catch (error: any) {
        throw new Error(
            `Error while fetching the customer with id '${id} : ${error.message}`
        );
    }
};

/**
 * description: delete a stripe customer
 * @param {string} id - stripe id of the customer to be fetched
 * @returns {object} customer deletion status object
 */
export const deleteCustomer = async (id: string) => {
    try {
        const deleted = await stripe.customers.del(id);

        return deleted;
    } catch (error: any) {
        console.error(error);
        throw new Error(
            `Error while deleting the customer with id '${id} : ${error.message}`
        );
    }
};

/**
 * description: create a new product
 * @param {string} id - id of the product to be created
 * @param {string} name - name of the product
 * @param {string} description - description of the product
 * @returns {Promise<object>} product
 */
export const createNewProduct = async (
    id: string,
    name: string,
    description: string
): Promise<Stripe.Product> => {
    try {
        const product = await stripe.products.create({
            id,
            name,
            description,
        });

        return product;
    } catch (error: any) {
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
 * @returns {Promise<object>} price
 */
export const createNewPrice = async (
    productId: string,
    unitAmount: number,
    currency: string = "usd"
): Promise<Stripe.Price> => {
    try {
        const price = await stripe.prices.create({
            product: productId,
            unit_amount: unitAmount,
            currency,
        });

        return price;
    } catch (error: any) {
        throw new Error(`Error while creating price, ${error.message}`);
    }
};

/**
 * description: create a new product and price for that product | Here, product is the event
 * @param {string} eventName - name of the event
 * @param {string} eventDescription - description of the event
 * @param {number} eventPrice - price of the event
 */
export const createNewProductAndPrice = async (
    productIdToBeUsed: string,
    eventName: string,
    eventDescription: string,
    eventPrice: number
) => {
    try {
        // stripe calculates price in cents
        eventPrice = eventPrice * 100;

        let price: Stripe.Price;
        let product: Stripe.Product;
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
    } catch (error: any) {
        throw new Error(
            `Error while generating product in Stripe for event ${eventName} : ${error.message}`
        );
    }
};

export const createNewCheckoutSession = async (
    priceId: string, // should be Stripe.Price but apparently their TS Type-declaration does not support it
    customerId: string, // should be Stripe.Customer but apparently their TS Type-declaration does not support it
    quantity: number = 1
) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity,
                },
            ],
            customer: customerId as string,
            success_url: process.env.SUCCESS_URL_PAYMENT as string,
            mode: "payment",
            metadata: {
                customerId,
                priceId,
            },
        });

        return session;
    } catch (error: any) {
        throw new Error(
            `Error while creating checkout session, ${error.message}`
        );
    }
};

export const getDesiredDataFromCheckoutSession = (
    checkoutSessionObj: Stripe.Checkout.Session
) => {
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
            metadata,
            status,
            url,
        } = checkoutSessionObj;

        // extracting the desired data from the checkout session object
        const { email, name } = customer_details ?? {}; // as Stripe.Checkout.Session.CustomerDetails;
        const { customerId, priceId } = metadata ?? {};
        const { amount_shipping, amount_discount, amount_tax } =
            total_details ?? {};

        return {
            status,
            sessionId: id,
            totalAmount: amount_total,
            sessionCreated: new Date(created * 1000),
            currency,
            userId: customer || customerId,
            priceId,
            paymentIntent: payment_intent,
            paymentStatus: payment_status,
            sessionUrl: url,
            amountShipping: amount_shipping,
            amountDiscount: amount_discount,
            amountTax: amount_tax,
            email: customer_email || email,
            name,
        };
    } catch (error) {
        console.log("Error in getDesiredDataFromCheckoutSession: ");
        throw error;
    }
};

export const createWebhook = async (
    rawBody: string | Buffer,
    signature: string | Buffer | Array<string>
) => {
    try {
        const event = await stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );

        return event;
    } catch (error) {
        console.log("Error in createWebhook: ");
        throw error;
    }
};
