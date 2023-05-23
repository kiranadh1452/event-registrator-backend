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
