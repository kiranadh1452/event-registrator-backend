import mongoose, { Schema } from "mongoose";

// importing types
import { IEventType, IEventTypeModel } from "./helpers/types";

export const eventTypeSchema: Schema<IEventType> = new Schema<IEventType>({
    name: {
        type: String,
        required: true,
        trim: true,
        index: "text",
    },
    description: {
        type: String,
        required: true,
        trim: true,
        index: "text",
    },
    createdBy: {
        type: String,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
    },
});

eventTypeSchema.pre<IEventType>("save", function (next) {
    this.updated_at = new Date();
    return next();
});

/**
 * @Static_Methods for EventType Schema
 */

// Fetch all event types
eventTypeSchema.statics.fetchEventTypes = async function (queryParams: any) {};

// Create a new event type
eventTypeSchema.statics.createEventType = async function (
    eventTypeData: any
) {};

// Delete an event type
eventTypeSchema.statics.deleteEventType = async function (
    eventTypeId: string
) {};
