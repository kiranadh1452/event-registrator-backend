import express from "express";
import stripeWebhookController from "./stripeWebhookController.js";

let router = express.Router();

// stripe webhook listner route
router.post("/webhook", stripeWebhookController);

export default router;
