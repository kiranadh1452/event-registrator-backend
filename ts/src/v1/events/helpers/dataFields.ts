import { eventSchema } from "../model.js";

const ignoreTheseFields = ["_id", "created_at", "updated_at", "organizerId"];

// required fields for signup - middleware would use this data
export const EventCreationRequirements = Object.keys(eventSchema.obj)
    .filter(
        (field) =>
            !ignoreTheseFields.includes(field) &&
            (eventSchema.obj as any)[field].required
    )
    .map((field) => field);

export const EventQueryFields = [
    "search",
    "maxPrice",
    "minPrice",
    "startAfter",
    "endBefore",
    "location_search",
    "maxAge",
    "minAge",
    "createdBefore",
    "createdAfter",
];

export const AllFieldsInEvent = Object.keys(eventSchema.obj)
    .filter((field) => !ignoreTheseFields.includes(field))
    .map((field) => field);
