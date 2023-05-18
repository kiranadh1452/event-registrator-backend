import express, { Request, Response, Router } from "express";

// import controllers
import {
    loginUser,
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} from "./controller.js";

// import middlewares
import { checkUserAuthentication } from "./middleware.js";

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
UserRouter.get("/", checkUserAuthentication, getAllUsers);

// get a user by id
UserRouter.get("/:id", getUserById);

// update a user by id
UserRouter.put("/:id", checkUserAuthentication, updateUserById);

// login a user
UserRouter.post("/login", checkUserAuthentication, loginUser);

// delete a user
UserRouter.delete("/:id", checkUserAuthentication, deleteUserById);

export default UserRouter;
