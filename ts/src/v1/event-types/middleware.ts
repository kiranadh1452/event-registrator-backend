// reusing the user authentication middleware from the user module
import UserModule from "../users";

export const userAuthenticatorForEventTypesMiddleware =
    UserModule.Middleware.checkUserAuthentication;
