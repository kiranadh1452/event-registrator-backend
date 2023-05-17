import { Response } from "express";

interface SuccessResponse {
    code: number;
    message: string;
    data?: any;
}

interface ErrorResponse {
    code: number;
    message: string;
    details?: any;
}

/**
 * Function to send a success response
 */
export const sendSuccessRes = async (
    res: Response,
    data: SuccessResponse
) => {
    // check if data.code is not in the 200 range and throw error
    if (data.code < 200 || data.code > 299) {
        throw new Error("Invalid status code");
    }

    return res.status(data.code).json({
        code: data.code,
        message: data.message,
        data: data.data,
    });
};

/**
 * Function to send an error response
 */
export const sendErrorRes = async (res: Response, data: ErrorResponse) => {
    // check if the response code is not in the 400 or 500 range and throw error
    if (data.code < 400 || data.code > 599) {
        throw new Error("Invalid status code");
    }

    return res.status(data.code).json({
        error: {
            code: data.code,
            message: data.message,
            details: data.details,
        },
    });
};
