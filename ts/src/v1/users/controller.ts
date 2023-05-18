import { Request, Response, NextFunction } from "express";

import User from "./model.js";
import { sendSuccessResponse, sendErrorResponse } from "./responseHandler.js";

// Get all users controller
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.fetchUsers(req.query);
        return sendSuccessResponse(res, 200, "Success", users);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

// Create a user
export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.createUser(req.body);

        return sendSuccessResponse(res, 201, "User created successfully", user);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

// Get user by ID
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // search for the user by Id and if not found return 404
        const user = await User.findById(id, { password: 0, __v: 0 }).exec();

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        return sendSuccessResponse(res, 200, "Success", user);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

// update the user by id
export const updateUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // It's important to sanitize the user input here to prevent a potential NoSQL injection.
        // Ensuring that `id` is a string and passing it directly to `findById` should be safe.
        if (typeof id !== "string") {
            return sendErrorResponse(res, 400, `Invalid user ID`);
        }

        const user = await User.findById(id).exec();
        if (!user) {
            return sendErrorResponse(res, 404, `User with ID ${id} not found`);
        }

        await user.updateUser(req.body);

        return sendSuccessResponse(res, 200, "User updated successfully", user);
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};
