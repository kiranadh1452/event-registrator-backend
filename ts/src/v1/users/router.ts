import express, { Request, Response, Router } from "express";

// import router specific config
import { UserSignUpRequirements } from "./config/dataFields.js";

// import global - data validation middlewares
import {
    nonEmptyValidation,
    validationResultHandler,
} from "../validation-middlewares/dataFormatValidation.js";

// import controllers
import {
    loginUser,
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} from "./controller.js";

// import local middlewares
import {
    checkUserAuthentication,
    isLoggedInUserRequesting,
} from "./middleware.js";

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
UserRouter.post(
    "/",
    nonEmptyValidation(UserSignUpRequirements),
    validationResultHandler,
    createUser
);

// get all users
UserRouter.get("/", checkUserAuthentication, getAllUsers);

// get a user by id
UserRouter.get(
    "/:id",
    checkUserAuthentication,
    isLoggedInUserRequesting,
    getUserById
);

// update a user by id
UserRouter.put("/:id", checkUserAuthentication, updateUserById);

// login a user
UserRouter.post("/login", checkUserAuthentication, loginUser);

// delete a user
UserRouter.delete("/:id", checkUserAuthentication, deleteUserById);

export default UserRouter;
