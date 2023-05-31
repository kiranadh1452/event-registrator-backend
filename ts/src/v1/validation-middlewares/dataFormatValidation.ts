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

export const sanitizeData = (dataArray: Array<String>) => {
    try {
        const sanitizations: Array<ValidationChain> = [];
        dataArray.forEach((data) => {
            sanitizations.push(
                check(data as string)
                    .optional()
                    .trim()
                    .escape()
            );
        });

        return sanitizations;
    } catch (error) {
        console.log(error);
        throw new Error("Error while sanitizing the data fields");
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
                                `${data} must be at between 2 to 20 characters`
                            )
                    );
                    break;

                // text indexes
                case "name":
                case "search":
                case "type": // for now, type has to be a string. If there are multi types, we can change this to enum
                case "location_search":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 2, max: 50 })
                            .withMessage(
                                `Search index ${data} must be at between 2 to 50 characters`
                            )
                    );
                    break;

                case "phoneNumber":
                case "emergencyContact":
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
                case "location":
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
                case "eventId":
                case "oraganizerId":
                case "subscription_id":
                case "userId":
                case "payment_intent":
                case "eventType":
                case "productId":
                case "priceId":
                case "createdBy":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isLength({ min: 8, max: 64 })
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

                case "price":
                case "maxPrice":
                case "minPrice":
                case "maxAge":
                case "minAge":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isNumeric()
                            .withMessage(`Invalid format for ${data}`)
                    );
                    break;

                case "maxTickets":
                case "ticketsSold":
                case "ticketsAvailable":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isInt({ min: 0 })
                            .withMessage(`Invalid format for ${data}`)
                    );
                    break;

                case "createdBefore":
                case "createdAfter":
                case "created_at":
                case "updated_at":
                case "startAfter":
                case "endBefore":
                case "startTime":
                case "endTime":
                    validations.push(
                        check(data as string)
                            .optional()
                            .isISO8601()
                            .withMessage(`Invalid format for ${data}`)
                    );
                    break;

                case "oldPriceIds":
                case "oldPrices":
                    // check that it is an array
                    // these values aren't used anywhere, so it's okay to just check that it's an array
                    validations.push(
                        check(data as string)
                            .optional()
                            .isArray()
                            .withMessage(`Invalid format for ${data}`)
                    );
                    break;

                case "paymentStatus":
                    // check that payment status is one of "paid" | "unpaid" | "no_payment_required"
                    validations.push(
                        check(data as string)
                            .optional()
                            .isIn(["paid", "unpaid", "no_payment_required"])
                            .withMessage(`Invalid format for ${data}`)
                    );
                    break;

                case "status":
                    // check that status is one of "open" | "complete" | "expired"
                    validations.push(
                        check(data as string)
                            .optional()
                            .isIn(["open", "complete", "expired"])
                            .withMessage(`Invalid format for ${data}`)
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
