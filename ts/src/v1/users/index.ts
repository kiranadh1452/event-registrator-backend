import UserRouter from "./router";
import UserModel from "./model";
import * as UserController from "./controller";
import * as UserMiddleware from "./middleware";

const UserModule = {
    Router: UserRouter,
    Model: UserModel,
    Controller: UserController,
    Middleware: UserMiddleware,
};

export default UserModule;
