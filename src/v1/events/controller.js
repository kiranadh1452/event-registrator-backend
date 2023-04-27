import Event from "./model.js";
import { createNewProductAndPrice } from "../stripe-handler/stripeHandler.js";

// helper functions to reduce the code in the controller functions

export const getEventById = async (eventId, res, hasToBeOwner = true) => {
    try {
        const currentUserId = res.locals.authData._id;

        if (!eventId || !currentUserId) {
            return [
                false,
                {
                    code: 400,
                    message: "Bad Request",
                    details: "Invalid ID",
                },
            ];
        }

        // check if res.locals.current_event is present or not (The middleware "isCurrentUserEventOrganizer" will set this)
        // if it is present, then check the id of the event and return it
        // else fetch from database
        const event =
            res.locals?.current_event &&
            res.locals?.current_event._id?.toString() == eventId
                ? res.locals.current_event
                : await Event.findById(eventId).populate([
                      {
                          path: "organizer_id",
                          select: "-password -__v -created_at -updated_at",
                      },
                      {
                          path: "event_type",
                          select: "-__v -created_at -updated_at",
                      },
                  ]);

        if (!event) {
            return [
                false,
                {
                    code: 404,
                    message: "Not Found",
                    details: "Event not found",
                },
            ];
        }

        // the reson why I am using organizer_id._id is beacaue the organizer_id is populated with user object in above query
        const isCurrUserOwner =
            event.organizer_id._id.toString() == currentUserId;
        if (hasToBeOwner && !isCurrUserOwner) {
            return res.status(401).json({
                error: {
                    code: 401,
                    message: "Unauthorized",
                    details: "Access Denied",
                },
            });
        }

        return [true, event];
    } catch (error) {
        console.log(error);
        return [
            false,
            {
                code: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        ];
    }
};

// get all events
export const getAllEventsController = async (req, res) => {
    try {
        const {
            search,
            organizer_id,
            created_at_before,
            created_at_after,
            start_time_after,
            end_time_before,
            location,
            event_type,
        } = req.query;

        let filters = {};

        // if any of the query params is present, then add it to the filters object
        {
            if (search) {
                filters["$or"] = [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ];
            }

            if (organizer_id) {
                filters["organizer_id"] = organizer_id;
            }

            if (created_at_before) {
                filters["created_at"] = {
                    ...filters["created_at"],
                    $lt: new Date(created_at_before),
                };
            }

            if (created_at_after) {
                filters["created_at"] = {
                    ...filters["created_at"],
                    $gte: new Date(created_at_after),
                };
            }

            if (start_time_after) {
                filters["start_time"] = {
                    ...filters["start_time"],
                    $gte: new Date(start_time_after),
                };
            }

            if (end_time_before) {
                filters["end_time"] = {
                    ...filters["end_time"],
                    $lt: new Date(end_time_before),
                };
            }

            if (location) {
                filters["location"] = { $regex: location, $options: "i" };
            }

            if (event_type) {
                filters["event_type"] = event_type;
            }
        }

        const events = await Event.find(filters).populate({
            path: "organizer_id",
            select: "-password -__v -created_at -updated_at",
        });

        return res.status(201).json({
            code: 200,
            message: "OK",
            data: events,
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};

// create a new event
export const createEventController = async (req, res) => {
    try {
        const {
            name,
            description,
            start_time,
            end_time,
            location,
            image,
            event_type,
            price,
            min_age,
            max_age,
            emergency_contact,
        } = req.body;

        // create a new product and price in stripe
        const { priceId, productId } = await createNewProductAndPrice(
            name,
            description,
            price
        );

        // create the new event
        const newEvent = new Event({
            name,
            productId,
            priceId,
            price,
            description,
            start_time,
            end_time,
            location,
            min_age,
            max_age,
            emergency_contact,
            image,
            event_type,
            organizer_id: res.locals.authData._id,
        });

        // save the new event to the database
        await newEvent.save();

        return res.status(201).json({
            code: 201,
            message: "Created",
            data: newEvent,
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};

// get an event by id
export const getEventByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // get the event by id and if there are some issues, then return the error
        const [success, event] = await getEventById(id, res);
        if (!success) {
            return res.status(event.code || 404).json({
                error: event,
            });
        }

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: event,
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};

// update an event by id
export const updateEventByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            description,
            start_time,
            end_time,
            location,
            image,
            event_type,
            price,
            min_age,
            max_age,
            emergency_contact,
        } = req.body;

        const [success, event] = await getEventById(id, res);
        if (!success) {
            return res.status(event.code || 404).json({
                error: event,
            });
        }

        // update the event
        const propsToUpdate = {
            description,
            start_time,
            end_time,
            location,
            image,
            event_type,
            price,
            min_age,
            max_age,
            emergency_contact,
        };
        Object.keys(propsToUpdate).forEach((key) => {
            if (propsToUpdate[key]) {
                event[key] = propsToUpdate[key];
            }
        });

        // save the updated event to the database
        await event.save();

        // TODO: Update the product and price in stripe

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: event,
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};

// delete an event by id
export const deleteEventByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const [success, event] = await getEventById(id, res);
        if (!success) {
            return res.status(event.code || 400).json({
                error: event,
            });
        }

        // TODO: Does any of the other data need to be deleted when event is deleted?

        await Event.findByIdAndDelete(id);

        return res.status(200).json({
            code: 200,
            message: "Event deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};
