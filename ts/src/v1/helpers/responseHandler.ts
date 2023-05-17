import { Response } from "express";

/**
 * Function to send a success response
 */
export const sendSuccessRes = async (
    res: Response,
    code: number,
    message: string,
    data?: any
) => {
    // check if data.code is not in the 200 range and throw error
    if (code < 200 || code > 299) {
        throw new Error("Invalid status code for a success response");
    }

    return res.status(code).json({
        code,
        message,
        data,
    });
};

/**
 * Function to send an error response
 */
export const sendErrorRes = async (
    res: Response,
    code: number,
    message: string,
    details?: any
) => {
    // check if the response code is not in the 400 or 500 range and throw error
    if (code < 400 || code > 599) {
        throw new Error("Invalid status code for an error response");
    }

    return res.status(code).json({
        error: {
            code,
            message,
            details,
        },
    });
};
