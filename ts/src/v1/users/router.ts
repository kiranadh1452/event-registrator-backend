import express, { Request, Response, Router } from "express";

// import controllers
import {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    loginUser,
} from "./controller.js";

const UserRouter: Router = express.Router();

// This is a test endpoint
UserRouter.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Users",
    });
});

// create a user
UserRouter.post("/", createUser);

// get all users
UserRouter.get("/", getAllUsers);

// get a user by id
UserRouter.get("/:id", getUserById);

// update a user by id
UserRouter.put("/:id", updateUserById);

// login a user
UserRouter.post("/login", loginUser);
export default UserRouter;
