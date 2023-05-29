// reusing the user middleware for events
// If any changes are required, we might change here
import UserModule from "../users";

export const userAuthenticatorForEventsMiddleware =
    UserModule.Middleware.checkUserAuthentication;

export const isCurrentUserEventOrganizer =
    UserModule.Middleware.isLoggedInUserRequesting;
