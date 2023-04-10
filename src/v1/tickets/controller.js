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
