import express from "express";

// Import middleware here
import { userAuthenticatorForEventsMiddleware } from "./middleware.js";

// Import the event controller here

const router = express.Router();

router.use(userAuthenticatorForEventsMiddleware);

// Define the event routes here
router.get("/test", (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Events",
    });
});

export default router;
