import express, { Request, Response, Router } from "express";

const EventTypeRouter: Router = express.Router();

// This is a test endpoint
EventTypeRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Event Types",
    });
});

export default EventTypeRouter;
