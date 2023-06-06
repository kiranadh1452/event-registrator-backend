import express, { Request, Response, Router } from "express";

// import controller
import * as StripeController from "./stripeWebhookController";

const WebhookRouter: Router = express.Router();

// This is a test endpoint
WebhookRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Events",
    });
});

// This route would be used as a stripe webhook listner endpoint
WebhookRouter.post("/webhook", StripeController.stripeWebhookController);

export default WebhookRouter;
