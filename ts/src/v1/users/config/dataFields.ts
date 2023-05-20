import { userSchema } from "../model.js";

const ignoreTheseFields = ["_id", "created_at", "updated_at"];

// required fields for signup - middleware would use this data
export const UserSignUpRequirements = Object.keys(userSchema.obj)
    .filter(
        (field) =>
            !ignoreTheseFields.includes(field) &&
            (userSchema.obj as any)[field].required
    )
    .map((field) => field);
