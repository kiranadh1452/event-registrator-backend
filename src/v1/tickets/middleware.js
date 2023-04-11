import { isEventOrganizer } from "../events/middleware.js";
import { userAuthenticatorMiddleware } from "../users/middleware.js";

// for now, lets reuse the userAuthenticatorMiddleware
// but since we are doing everything modular, having a separate middleware for tickets is a good idea
export const userAuthenticatorForTicketsMiddleware =
    userAuthenticatorMiddleware;

// This is the middleware to check if the event is owned by the user trying to make the request
export const isEventOwnedByUserMiddleware = async (req, res, next) => {
    try {
        const id = req.query.eventId || req.body.eventId;

        isEventOrganizer(id, res, next);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: {
                status: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};
