import express, { Request, Response, Router } from "express";

// import router specific config
import { UserSignUpRequirements } from "./helpers/dataFields.js";

// import global - data validation middlewares
import {
    sanitizeData,
    dataFormatValidation,
    nonEmptyPlusDataValidation,
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
    nonEmptyPlusDataValidation(UserSignUpRequirements),
    sanitizeData(UserSignUpRequirements),
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
    nonEmptyPlusDataValidation(["id"]),
    sanitizeData(["id"]),
    validationResultHandler,
    getUserById
);

// update a user by id
UserRouter.put(
    "/:id",
    checkUserAuthentication,
    isLoggedInUserRequesting,
    nonEmptyPlusDataValidation(["id"]), // id can't be empty or invalid
    dataFormatValidation(UserSignUpRequirements),
    sanitizeData([...UserSignUpRequirements, "id"]),
    // any of the sign up fields could be edited but they may be empty, so using dataFormatValidation instead of nonEmptyPlusDataValidation
    updateUserById
);

// login a user
UserRouter.post(
    "/login",
    sanitizeData(["email", "password"]),
    nonEmptyPlusDataValidation(["email", "password"]),
    validationResultHandler,
    checkUserAuthentication,
    loginUser
);

// delete a user
UserRouter.delete(
    "/:id",
    checkUserAuthentication,
    isLoggedInUserRequesting,
    nonEmptyPlusDataValidation(["id"]),
    sanitizeData(["id"]),
    validationResultHandler,
    deleteUserById
);

export default UserRouter;
