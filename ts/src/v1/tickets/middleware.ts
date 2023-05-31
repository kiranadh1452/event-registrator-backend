import UserModule from "../users";

export const userAuthenticatorForTicketsMiddleware =
    UserModule.Middleware.checkUserAuthentication;
