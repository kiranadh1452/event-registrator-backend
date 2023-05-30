import { eventTypeSchema } from "../model";

const ignoreTheseFields = ["_id", "created_at", "updated_at"];

// compulsory fields for creating a new event type
export const EventTypeCreationRequirements = Object.keys(eventTypeSchema.obj)
    .filter(
        (field) =>
            !ignoreTheseFields.includes(field) &&
            (eventTypeSchema.obj as any)[field].required
    )
    .map((field) => field);

export const EventTypeQueryFields = [
    "search",
    "createdBefore",
    "createdAfter",
    "createdBy",
];

export const AllFieldsInEventType = Object.keys(eventTypeSchema.obj);
