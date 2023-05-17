import { sendSuccessRes, sendErrorRes } from "../helpers/responseHandler.js";

export const sendSuccessResponse = sendSuccessRes;
export const sendErrorResponse = sendErrorRes;

// ! Question : Why are we importing and re-exporting the same function?
// This is because we want each module to be responsible for its own response handling so that they each would be a complete module on their own.

// ! Question: Then why are we not writing the response handling code in the controller itself?
// This is because we want to keep the controller as lean as possible. The controller should only be responsible for handling the request and
// sending the response. The controller should not be concerned with how the response is sent. This is the responsibility of the responseHandler module.

// ! Question: Why are we not writing the response handling code in the model itself?
// That would be good for future but for now, we are using a same responseHanlder format with all of our modules.
// That way, we make our code more DRY and we can easily swap out the responseHandler module with a different one in the future if we want to.
