import { Request, Response, NextFunction } from "express";
import { check, validationResult, ValidationChain } from "express-validator";

// import response handlers
import { sendErrorRes } from "../helpers/responseHandler.js";

export const nonEmptyValidation = (dataArray: Array<String>) => {
    try {
        const validations: Array<ValidationChain> = [];
        dataArray.forEach((data) => {
            validations.push(
                check(data as string)
                    .not()
                    .isEmpty()
                    .withMessage(`${data} field can't be empty`)
            );
        });

        return validations;
    } catch (error: any) {
        console.log(error);
        throw new Error("Error while validating the data fields");
    }
};

/**
 * description: Function to handle the validation results
 */
export const validationResultHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let errorLists = validationResult(req);
        if (errorLists.isEmpty()) {
            return next();
        }
        return sendErrorRes(
            res,
            422,
            "Invalid data format",
            errorLists.array()[0]
        );
    } catch (error: any) {
        return sendErrorRes(res, 500, "Something went wrong", error.message);
    }
};
