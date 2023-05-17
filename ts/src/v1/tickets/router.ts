import express, { Request, Response, Router } from "express";

const TicketRouter: Router = express.Router();

// This is a test endpoint
TicketRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Tickets",
    });
});

export default TicketRouter;
