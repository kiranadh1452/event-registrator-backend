import app from "./app.js";
import request from "supertest";

afterAll(() => {
    app.close();
});

const expectedData = [
    {
        path: "/test",
        method: "get",
        expectedCode: 200,
        expectedMessage: "Success",
        expectedData: "Root test endpoint",
    },
    {
        path: "/v1/users/test",
        method: "get",
        expectedCode: 200,
        expectedMessage: "Success",
        expectedData: "Test endpoint - Users",
    },
    {
        path: "/v1/events/test",
        method: "get",
        expectedCode: 200,
        expectedMessage: "Success",
        expectedData: "Test endpoint - Events",
    },
    {
        path: "/v1/event-types/test",
        method: "get",
        expectedCode: 200,
        expectedMessage: "Success",
        expectedData: "Test endpoint - Event Types",
    },
    {
        path: "/v1/tickets/test",
        method: "get",
        expectedCode: 200,
        expectedMessage: "Success",
        expectedData: "Test endpoint - Tickets",
    },
];

// Loop through the expectedData and test them
for (const endpoint of expectedData) {
    describe(`${(endpoint.method).toUpperCase()} ${endpoint.path} - ${endpoint.expectedData}`, () => {
        it("responds with status 200 and a success message", (done) => {
            request(app)
                [endpoint.method](endpoint.path)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.code).toBe(endpoint.expectedCode);
                    expect(res.body.message).toBe(endpoint.expectedMessage);
                    expect(res.body.data).toBe(endpoint.expectedData);
                    done();
                });
        });
    });
}
