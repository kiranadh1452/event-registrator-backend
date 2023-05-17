import express, { Request, Response, Router } from "express";

const UserRouter: Router = express.Router();

// This is a test endpoint
UserRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Users",
    });
});

export default UserRouter;
    