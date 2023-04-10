import Ticket from "./model.js";

// helper functions to reduce the code in the controller functions
const getTicketById = async (ticketId, res, hasToBeAdmin = true) => {
    try {
        const currentUser = res.locals.authData;

        // if the ticket id is not valid or the user is not logged in, then return
        if (!ticketId || Object.keys(currentUser).length == 0) {
            return [
                false,
                {
                    code: 400,
                    message: "Bad Request",
                    details: "Invalid ID",
                },
            ];
        }

        // if the requirement is to check if the user is admin or not, then check it
        if (hasToBeAdmin && !currentUser.isAdmin) {
            return [
                false,
                {
                    code: 401,
                    message: "Unauthorized",
                    details: "Access Denied",
                },
            ];
        }

        const ticket = await Ticket.findById(ticketId).populate(
            {
                path: "userId",
                select: "email firstName lastName",
            },
            {
                path: "eventId",
                select: "name",
            }
        );
        if (!ticket || Object.keys(ticket).length == 0) {
            return [
                false,
                {
                    code: 404,
                    message: "Not Found",
                    details: "Ticket not found",
                },
            ];
        }

        return [true, ticket];
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

/**
 * description: Function to get all the tickets
 */
export const getTicketsController = async (req, res, next) => {
    try {
        const {
            eventId,
            quantity,
            type,
            status,
            sessionId,
            session_created_before,
            session_created_after,
            total_amount_min,
            total_amount_max,
            currency,
            userId,
            priceId,
            payment_intent,
            payment_status,
            session_url,
        } = req.query;

        const filter = {};

        if (eventId) {
            filter.eventId = eventId;
        }
        if (quantity) {
            filter.quantity = quantity;
        }
        if (type) {
            filter.type = type;
        }
        if (status) {
            filter.status = status;
        }
        if (sessionId) {
            filter.sessionId = sessionId;
        }
        if (session_created_before) {
            filter.session_created = {
                $lt: new Date(session_created_before),
            };
        }
        if (session_created_after) {
            filter.session_created = {
                $gt: new Date(session_created_after),
            };
        }
        if (total_amount_min) {
            filter.total_amount = {
                $gte: total_amount_min,
            };
        }
        if (total_amount_max) {
            filter.total_amount = {
                $lte: total_amount_max,
            };
        }
        if (currency) {
            filter.currency = currency;
        }
        if (userId) {
            filter.userId = userId;
        }
        if (priceId) {
            filter.priceId = priceId;
        }
        if (payment_intent) {
            filter.payment_intent = payment_intent;
        }
        if (payment_status) {
            filter.payment_status = payment_status;
        }
        if (session_url) {
            filter.session_url = session_url;
        }

        const tickets = await Ticket.find(filter).populate(
            {
                path: "userId",
                select: "email firstName lastName",
            },
            {
                path: "eventId",
                select: "name",
            }
        );

        return res.status(200).json({
            code: 200,
            message: "Success",
            data: tickets,
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

/**
 * description: Function to get a specific ticket by id
 */
export const getTicketByIdController = async (req, res, next) => {
    try {
        const ticketId = req.params.id;

        const [isSuccess, result] = await getTicketById(ticketId, res);
        if (!isSuccess) {
            return res.status(result.code).json({
                error: result,
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Success",
            data: result,
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

/**
 * description: Function to create a new ticket
 */
export const createTicketController = async (req, res, next) => {
    try {
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

// export const updateTicketController = async (req, res, next) => {
//     try {
//     } catch (error) {
//         return res.status(500).json({
//             error: {
//                 code: 500,
//                 message: "Internal Server Error",
//                 details: error.message,
//             },
//         });
//     }
// };

/**
 * description: Function to delete a ticket by id
 */
export const deleteTicketController = async (req, res, next) => {
    try {
        const ticketId = req.params.id;

        const [isSuccess, result] = await getTicketById(ticketId, res);
        if (!isSuccess) {
            return res.status(result.code).json({
                error: result,
            });
        }

        // TODO: Does any other data need to be deleted?

        await Ticket.findByIdAndDelete(ticketId);

        return res.status(200).json({
            code: 200,
            message: "Success",
            data: result,
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
