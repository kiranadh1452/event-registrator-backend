import { Request, Response, NextFunction } from "express";

import User, { IUser } from "./model.js";
import { sendSuccessResponse, sendErrorResponse } from "./responseHandler.js";

// Get all users controller
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Fetch the query parameters
        const {
            first_name,
            email,
            created_at_before,
            created_at_after,
            is_admin,
        } = req.query;

        const query: any = {};

        // Formulate the query object based on the query parameters
        if (first_name) query.firstName = { $regex: first_name, $options: "i" };
        if (email) query.email = { $regex: email, $options: "i" };
        if (created_at_before) query.created_at = { $lte: created_at_before };
        if (created_at_after) query.created_at = { $gte: created_at_after };
        if (is_admin !== undefined) query.is_admin = is_admin;

        const users: IUser[] = await User.find(query, {
            password: 0,
            __v: 0,
        }).exec();

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

        // check if user already exists and return 409 if true
        console.log("Checking if there are users with the same email");
        const userExists = await User.find({ email });

        if (userExists && Object.keys(userExists).length > 0) {
            return sendErrorResponse(res, 409, "User already exists");
        }

        // create a new user
        const user: IUser = new User({
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

        // create stripe customer for the user
        // try {
        //     await addNewCustomer(user._id.toString(), user.email);
        // } catch (error) {
        //     console.log("Stripe customer creation failed");

        //     return res.status(500).json({
        //         error: {
        //             code: 500,
        //             message: "Internal Server Error",
        //             details:
        //                 "User created only in database. Stripe customer creation failed",
        //             user,
        //         },
        //     });
        // }

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
