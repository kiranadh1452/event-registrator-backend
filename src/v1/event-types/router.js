import express from "express";

// Import the event controller here

const router = express.Router();

// Define the event routes here
router.get("/test", (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Event Types",
    });
});

export default router;
