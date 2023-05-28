import tape from "tape";
import { addNewCustomer, getCustomer, deleteCustomer } from "./stripeHandler";

const testCustomerData = {
    customer1: {
        id: "cus_1_zibrisData",
        email: "test_customer1@test.com",
    },
    customer2: {
        id: "cus_2_zibrisData",
        email: "test_customer2@test.com",
    },
};

tape("Test customer creation in stripe", async (t) => {
    try {
        const { id, email } = testCustomerData.customer1;
        const customer = await addNewCustomer(id, email);

        t.equal(customer.id, id, "Customer id should be same as provided");
        t.equal(
            customer.email,
            email,
            "Customer email should be same as provided"
        );

        t.end();
    } catch (error: any) {
        t.error(error);
    }
});

tape("Test customer fetching from stripe", async (t) => {
    try {
        const testCustomer = testCustomerData.customer1;
        const customer = await getCustomer(testCustomer.id);

        t.deepEqual(
            customer,
            testCustomer,
            "Customer fetched should be same as provided"
        );

        t.end();
    } catch (error: any) {
        t.error(error);
    }
});

tape("Test customer deletion from stripe", async (t) => {
    try {
        const testCustomer = testCustomerData.customer1;
        const deleted = await deleteCustomer(testCustomer.id);

        t.equal(
            deleted.deleted,
            true,
            "Customer deletion status should be true"
        );

        t.end();
    } catch (error: any) {
        t.error(error);
    }
});
