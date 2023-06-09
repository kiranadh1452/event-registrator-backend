import EventType from "./model.js";

/**
 * description: This is just a helper function to reduce the code in the controller functions
 * @param {String} eventTypeId - The ID of the event type
 * @param {Object} res - The response object
 * @param {Boolean} hasToBeAdmin - If the user has to be an admin to access the event type
 * @returns {Array} - An array with two elements. The first element is a boolean value indicating if the operation was successful or not.
 * The second element is either the event type object or an error object
 */
const getEventTypeById = async (eventTypeId, res, hasToBeAdmin = true) => {
    try {
        const currentUser = res.locals.authData;

        // if the user is not authenticated or the event type ID is not present, return an error
        if (!eventTypeId || Object.keys(currentUser).length == 0) {
            return [
                false,
                {
                    code: 400,
                    message: "Bad Request",
                    details: "Missing ID",
                },
            ];
        }

        // if the user is not an admin and the event type has to be accessed by an admin, return an error
        if (hasToBeAdmin && !currentUser.is_admin) {
            return res.status(401).json({
                error: {
                    code: 401,
                    message: "Unauthorized",
                    details: "Access Denied",
                },
            });
        }

        // get the event type from the database and if it doesn't exist, return an error
        const eventType = await EventType.findById(eventTypeId).populate({
            path: "created_by",
            select: "email firstName lastName",
        });
        if (!eventType || Object.keys(eventType).length == 0) {
            return [
                false,
                {
                    code: 404,
                    message: "Not Found",
                    details: "Event Type not found",
                },
            ];
        }

        return [true, eventType];
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

// get all event types
export const getAllEventTypesController = async (req, res, next) => {
    try {
        // get the query parameters
        const { search, created_at_before, created_at_after, created_by } =
            req.query;

        let query = {};

        // formulate the query object based on the query parameters
        {
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ];
            }

            if (created_at_before) {
                query.created_at = {
                    ...query.created_at,
                    $lt: new Date(created_at_before),
                };
            }

            if (created_at_after) {
                query.created_at = {
                    ...query.created_at,
                    $gt: new Date(created_at_after),
                };
            }

            if (created_by) {
                query.created_by = created_by;
            }
        }

        // get the event types from the database
        const eventTypes = await EventType.find(query).populate({
            path: "created_by",
            select: "email firstName lastName",
        });

        return res.status(200).json({
            success: true,
            message: "OK",
            data: eventTypes,
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

// create a new event type
export const createEventTypeController = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // why no checks for duplicate event types?
        // Because the database is auto handling that during save

        // create the new event
        const newEventType = new EventType({
            name,
            description,
            created_by: res.locals.authData._id,
        });

        // save the new event to the database
        const savedEventType = await newEventType.save();

        return res.status(201).json({
            code: 201,
            message: "Created",
            data: savedEventType,
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

// get a specific event type by ID
export const getEventTypeByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        // get the event type from the database and if it doesn't exist, return an error
        const [success, eventType] = await getEventTypeById(id, res, false);
        if (!success) {
            return res.status(eventType.code).json({
                error: eventType,
            });
        }

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: eventType,
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

// update a specific event type by ID
export const updateEventTypeByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // get the event type from the database and if it doesn't exist, return an error
        const [success, eventType] = await getEventTypeById(id, res);

        if (!success) {
            return res.status(eventType.code).json({
                error: eventType,
            });
        }

        // update the event type
        const propsToUpdate = { name, description };
        Object.keys(propsToUpdate).forEach((key) => {
            if (propsToUpdate[key]) {
                eventType[key] = propsToUpdate[key];
            }
        });

        // save the updated event type to the database
        await eventType.save();

        return res.status(200).json({
            code: 200,
            message: "Event Type updated successfully",
            data: eventType,
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

// delete a specific event type by ID
export const deleteEventTypeByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        // get the event type from the database and if it doesn't exist, return an error
        const [success, eventType] = await getEventTypeById(id, res);
        if (!success) {
            return res.status(eventType.code).json({
                error: eventType,
            });
        }

        // TODO: Does any of the other data need to be deleted when event type is deleted?

        await EventType.findByIdAndDelete(id);

        return res.status(200).json({
            code: 200,
            message: "Event Type deleted successfully",
            data: eventType,
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
