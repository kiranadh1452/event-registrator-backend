import { sendErrorResponse } from "./responseHandler";
import { checkFirebaseToken } from "./firebaseHandler";
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
        req.body.locals = decodedToken;

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
