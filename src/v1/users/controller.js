import jwt from "jsonwebtoken";
import User from "./model.js";
import { addNewCustomer } from "../stripe-handler/stripeHandler.js";

// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const {
            first_name,
            email,
            created_at_before,
            created_at_after,
            is_admin,
        } = req.query;

        const query = {};

        if (first_name) query.firstName = { $regex: first_name, $options: "i" };
        if (email) query.email = { $regex: email, $options: "i" };
        if (created_at_before) query.created_at = { $lte: created_at_before };
        if (created_at_after) query.created_at = { $gte: created_at_after };
        if (is_admin !== undefined) query.is_admin = is_admin;

        const users = await User.find(query, { password: 0, __v: 0 }).exec();

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
                details: error.message,
            },
        });
    }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id, { password: 0, __v: 0 }).exec();

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
                details: error.message,
            },
        });
    }
};

// Create a user
export const createUser = async (req, res, next) => {
    try {
        const {
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            zip_code,
            password,
            is_admin,
            dateOfBirth,
        } = req.body;

        const user = new User({
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            zip_code,
            password,
            is_admin,
            dateOfBirth,
        });

        await user.save();

        // create stripe customer
        try {
            await addNewCustomer(user._id.toString(), user.email);
        } catch (error) {
            console.log("Stripe customer creation failed");
            throw new Error(
                `User created successfully with id ${user._id} but stripe customer creation failed : ${error.message}`
            );
        }

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
                details: error.message,
            },
        });
    }
};

// Update a user by ID
export const updateUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            zip_code,
            password,
            is_admin,
            dateOfBirth,
        } = req.query;

        const user = await User.findById(id).exec();

        if (!user) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `User with ID ${id} not found`,
                },
            });
        }

        // Update user data
        const propsToUpdate = {
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            zip_code,
            password,
            is_admin,
            dateOfBirth,
        };

        Object.keys(propsToUpdate).forEach((key) => {
            if (propsToUpdate[key]) {
                user[key] = propsToUpdate[key];
            }
        });

        await user.save();

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.__v;

        return res.status(200).json({
            code: 200,
            message: "User updated successfully",
            data: userObj,
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

export const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { keep_events = false, keep_tickets = false } = req.query;

        const user = await User.findById(id).exec();

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
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            code: 200,
            message: "User deleted successfully",
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

// login user
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: "Resource not found",
                    details: "No user found with this details",
                },
            });
        }

        const passwordMatch = await user.authentication(password);

        if (!passwordMatch) {
            return res.status(401).json({
                error: {
                    code: 401,
                    message: "Invalid credentials",
                },
            });
        }

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.__v;

        const token = await jwt.sign({ ...userObj }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(200).json({
            message: "Authentication successful",
            id: user._id,
            token: token,
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
