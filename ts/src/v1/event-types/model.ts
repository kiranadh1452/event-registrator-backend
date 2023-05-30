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
eventTypeSchema.statics.fetchEventTypes = async function (queryParams: any) {
    const { search, createdBefore, createdAfter, createdBy } = queryParams;

    const query: any = {};

    if (search) {
        query["$or"] = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    if (createdBefore) {
        query["created_at"] = { ...query.created_at, $lte: createdBefore };
    }

    if (createdAfter) {
        query["created_at"] = { ...query.created_at, $gte: createdAfter };
    }

    if (createdBy) {
        query["createdBy"] = createdBy;
    }

    const eventTypes: IEventType[] = await this.find(query, {
        __v: 0,
    });

    return eventTypes;
};

// Create a new event type
eventTypeSchema.statics.createEventType = async function (eventTypeData: any) {
    const { name } = eventTypeData;

    // Check if event type already exists
    const eventType = await this.findOne({ name: { $eq: name } });

    if (eventType) {
        throw new Error("Event type already exists");
    }

    const newEventType: IEventType = await this.create(eventTypeData);

    // Create a new object to exclude __v
    const { __v, ...eventTypeObj } = newEventType.toObject();

    return eventTypeObj;
};

// Delete an event type
eventTypeSchema.statics.deleteEventType = async function (
    eventTypeId: string
) {};

const EventType: IEventTypeModel = mongoose.model<IEventType, IEventTypeModel>(
    "EventType",
    eventTypeSchema
);

export default EventType;
