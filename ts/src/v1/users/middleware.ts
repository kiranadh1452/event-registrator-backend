import { sendErrorResponse } from "./helpers/responseHandler";
import { checkFirebaseToken } from "./helpers/firebaseHandler";
import { Request, Response, NextFunction } from "express";

export const checkUserAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return sendErrorResponse(
                res,
                401,
                "Unauthorized",
                "No token provided"
            );
        }

        const token = authorization.split(" ")[1];
        const decodedToken = await checkFirebaseToken(token);

        if (!decodedToken) {
            return sendErrorResponse(res, 401, "Unauthorized", "Invalid token");
        }

        // populate request body with the uid
        res.locals = { authData: decodedToken };

        next();
    } catch (error: any) {
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};

/**
 * description: This middleware will check if the requested user is the currently logged in user
 * @Usage : This middleware should be used after the userAuthenticatorMiddleware
 * @Usecase : To verify that the user being updated / deleted is the currently logged in user
 */
export const isLoggedInUserRequesting = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get the id from the request object
        const id = req.params?.id || req.query?.id;

        // if the id doesnot match the id of the currently logged in user, return 401
        if (id !== res.locals.authData.uid) {
            return sendErrorResponse(res, 401, "Unauthorized", "Access Denied");
        }

        next();
    } catch (error: any) {
        console.log(error);
        return sendErrorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );
    }
};
