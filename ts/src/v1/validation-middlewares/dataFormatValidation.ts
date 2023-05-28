import { Request, Response, NextFunction } from "express";
import { check, validationResult, ValidationChain } from "express-validator";

// import response handlers
import { sendErrorRes } from "../helpers/responseHandler.js";

// makes sure that the data fields passed in dataArray are not empty
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

// makes sure that the data fields passed in dataArray are of correct format or empty
export const dataFormatValidation = (dataArray: Array<String>) => {
    try {
        const validations: Array<ValidationChain> = [];

        dataArray.forEach((data) => {
            switch (data) {
                case "email":
                    // case "company_email":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isEmail()
                            .withMessage("Invalid email format")
                    );
                    break;

                case "password":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 8, max: 20 })
                            .withMessage(
                                "Password must be at between 8 to 20 characters"
                            )
                    );
                    break;

                case "firstName":
                case "lastName":
                case "middleName":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 2, max: 20 })
                            .withMessage(
                                "Name must be at between 2 to 20 characters"
                            )
                    );
                    break;

                case "phoneNumber":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isMobilePhone("any")
                            .withMessage("Invalid phone number format")
                    );
                    break;

                case "linkUrl":
                case "personalWebsite":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isURL()
                            .withMessage("Invalid shop url format")
                    );
                    break;

                case "otp":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 6, max: 8 })
                            .withMessage("Invalid OTP")
                    );
                    break;

                case "country":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 2, max: 3 })
                            .withMessage("Invalid country code")
                    );
                    break;

                case "dateOfBirth":
                    // check if the date is at least 10 years old
                    validations.push(
                        check(data as string)
                            .optional()
                            .custom((value) => {
                                const date = new Date(value);
                                const today = new Date();
                                const age =
                                    today.getFullYear() - date.getFullYear();
                                const month =
                                    today.getMonth() - date.getMonth();
                                if (
                                    month < 0 ||
                                    (month === 0 &&
                                        today.getDate() < date.getDate())
                                ) {
                                    return age - 1 >= 10;
                                }
                                return age >= 10;
                            })
                            .withMessage("You must be at least 10 years old")
                    );
                    break;

                case "description":
                case "address":
                case "company_address":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 10, max: 1000 })
                            .withMessage(
                                "Description must be at between 10 to 1000 characters"
                            )
                    );
                    break;

                case "id":
                case "subscription_id":
                case "userId":
                case "payment_intent":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 10, max: 64 })
                            .withMessage("Invalid ID")
                    );
                    break;

                case "zipCode":
                    validations.push(
                        check(data as string)
                            .optional()
                            .matches(/^[0-9]{5}(?:-[0-9]{4})?$/)
                            .withMessage("Invalid zip code format")
                    );
                    break;

                default:
                    console.log(`No validation for data: ${data}`);
                    break;
            }
        });

        return validations;
    } catch (error: any) {
        throw new Error(`Error while validating data format ${error.message}`);
    }
};

// makes sure that the data fields passed in dataArray are of correct format and non-empty
export const nonEmptyPlusDataValidation = (dataArray: Array<String>) => {
    const nonEmptyDataValidationArray = nonEmptyValidation(dataArray);
    const dataFormatValidationArray = dataFormatValidation(dataArray);
    return [...nonEmptyDataValidationArray, ...dataFormatValidationArray];
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
