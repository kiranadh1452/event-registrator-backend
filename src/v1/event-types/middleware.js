import UserModule from "../users";

// for now, lets reuse the userAuthenticatorMiddleware
// but since we are doing everything modular, having a separate middleware for events is a good idea
export const userAuthenticatorForEventTypesMiddleware =
    UserModule.middleware.userAuthenticatorMiddleware;
