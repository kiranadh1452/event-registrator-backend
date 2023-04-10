import Event from "./model.js";
import { userAuthenticatorMiddleware } from "../users/middleware.js";

// for now, lets reuse the userAuthenticatorMiddleware
// but since we are doing everything modular, having a separate middleware for events is a good idea
export const userAuthenticatorForEventsMiddleware = userAuthenticatorMiddleware;

// this middleware will check if the user is the organizer of the event
export const isCurrentUserEventOrganizer = async (req, res, next) => {
    try {
        let id = req.params?.id || req.query?.id || req.body?.id;

        if (!id || !res.locals.authData) {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: "Bad Request",
                    details: "No id provided",
                },
            });
        }

        // find the event by id
        const event = await Event.findById(id);

        // if no event found, return 404
        if (!event) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: "Not Found",
                    details: "No event found with the given id",
                },
            });
        }

        // TODO: Try to see if we can pass on this event into the controller itself so that we can avoid one fetch operation extra

        if (event.organizer_id.toString() !== res.locals.authData._id) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Access Denied",
                },
            });
        }

        next();
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
