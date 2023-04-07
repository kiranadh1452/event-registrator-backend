import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * description: create a customer
 * @param {string} email - email of the customer
 * @param {string} id - id of the customer
 * @returns {object} customer
 */
export const addNewCustomer = async ({ id, email }) => {
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
export const createNewProduct = async (name, description) => {
    try {
        const product = await stripe.products.create({
            name,
            description,
        });

        return product;
    } catch (error) {
        throw new Error(`Error while creating product '${name}' : ${error.message}`);
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
