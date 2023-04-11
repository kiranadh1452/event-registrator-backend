import { userAuthenticatorMiddleware } from "../users/middleware.js";

// for now, lets reuse the userAuthenticatorMiddleware
// but since we are doing everything modular, having a separate middleware for tickets is a good idea
export const userAuthenticatorForTicketsMiddleware =
    userAuthenticatorMiddleware;
