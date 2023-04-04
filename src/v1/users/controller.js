import User from "./model.js";

// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const { name, email, created_at_before, created_at_after, is_admin } =
            req.query;

        const query = {};

        if (name) query.name = { $regex: name, $options: "i" };
        if (email) query.email = { $regex: email, $options: "i" };
        if (created_at_before) query.createdAt = { $lte: created_at_before };
        if (created_at_after) query.createdAt = { $gte: created_at_after };
        if (is_admin !== undefined) query.is_admin = is_admin;

        const users = await User.find(query).exec();

        return res.status(200).json({
            code: 200,
            message: "Success",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error,
            },
        });
    }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).exec();

        if (!user) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: "User not found",
                },
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Success",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error,
            },
        });
    }
};

// Create a user
export const createUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            country,
            address,
            zip_code,
            is_admin,
            password_hash,
        } = req.body;

        const user = new User({
            name,
            email,
            phone,
            country,
            address,
            zip_code,
            is_admin,
            password_hash,
        });

        await user.save();

        return res.status(201).json({
            code: 201,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: "Internal Server Error",
                details: error,
            },
        });
    }
};

// Update a user by ID
export const updateUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `User with ID ${id} not found`,
                },
            });
        }

        // Update user data
        await user.update(req.body);

        return res.status(200).json({
            code: 200,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error",
            error,
        });
    }
};

export const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { keep_events = false, keep_tickets = false } = req.query;

        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({
                code: 404,
                message: `User with ID ${id} not found`,
            });
        }

        // Delete user events if keep_events is false
        // if (!keep_events) {
        //     await user.destroyEvents();
        // }

        // // Delete user tickets if keep_tickets is false
        // if (!keep_tickets) {
        //     await user.destroyTickets();
        // }

        // delete user
        await user.delete();

        return res.status(200).json({
            code: 200,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error",
            error,
        });
    }
};
