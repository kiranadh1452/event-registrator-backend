import jwt, { Secret } from "jsonwebtoken";
import admin, { ServiceAccount } from "firebase-admin";
import { Request, Response, NextFunction } from "express";

// file based imports
import User from "./model.js";
import { initializeFirebase, createUserInFirebase } from "./firebaseHandler.js";
import { sendSuccessResponse, sendErrorResponse } from "./responseHandler.js";

// initializing admin SDK
initializeFirebase();

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
        // Create user in Firebase
        const userRecord = await createUserInFirebase(
            req.body.email,
            req.body.password
        );

        const user = await User.createUser({
            ...req.body,
            _id: userRecord.uid,
        });

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

// login user
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get email and password from request body
        const { email, password, remember_me } = req.body;

        // check if user exists and return 404 if not
        const user = await User.findOne({ email: email }); // do not trim password from here yet as it is needed to be used for authentication

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // verify password and return 401 if not valid
        const passwordMatch = await user.authentication(password);

        if (!passwordMatch) {
            return sendErrorResponse(res, 401, "Invalid credentials");
        }

        // remove password and __v from user object
        const { password: pwd, __v, ...userObj } = user.toObject();

        // set token expiration time
        const expiresIn = remember_me ? "7d" : "1h";

        // generate an access token and return it
        const token = jwt.sign(
            { ...userObj },
            process.env.JWT_SECRET as Secret,
            {
                expiresIn,
            }
        );

        return sendSuccessResponse(res, 200, "Success", {
            id: userObj._id,
            token,
        });
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

// Delete a user by ID
export const deleteUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { keep_events = false, keep_tickets = false } = req.query;

        // Delete user events if keep_events is false
        // if (!keep_events) {
        //     await user.destroyEvents();
        // }

        // // Delete user tickets if keep_tickets is false
        // if (!keep_tickets) {
        //     await user.destroyTickets();
        // }

        // delete user
        const userFoundAndDeleted = await User.deleteUser(id);

        if (!userFoundAndDeleted) {
            return sendErrorResponse(res, 404, "User not found");
        }

        return sendSuccessResponse(res, 200, "User deleted successfully");
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};
