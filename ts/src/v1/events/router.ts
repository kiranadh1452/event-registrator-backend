import express, { Request, Response, Router } from "express";

const EventRouter: Router = express.Router();

// This is a test endpoint
EventRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Events",
    });
});

export default EventRouter;
