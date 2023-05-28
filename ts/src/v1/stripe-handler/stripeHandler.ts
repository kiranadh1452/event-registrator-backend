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
