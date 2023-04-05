import * as userRouter from "./router.js";
import * as userMiddleware from "./middleware.js";
import * as userController from "./controller.js";

const UserModule = {
    router: userRouter,
    middleware: userMiddleware,
    controller: userController,
};

export default UserModule;
