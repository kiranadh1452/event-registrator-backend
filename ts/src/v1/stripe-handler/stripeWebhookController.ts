import { Request, Response, NextFunction } from "express";

export const stripeWebhookController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const signature = req.headers["stripe-signature"];
        let event;
        let rawBody = req.body;

        return res.status(501).json({
            code: 501,
            message: "Not implemented",
            data: "Stripe webhook endpoint",
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
