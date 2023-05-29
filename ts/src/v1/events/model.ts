import mongoose, { Schema } from "mongoose";

// importing types
import { IEvent, IEventModel } from "./helpers/types";

export const eventSchema: Schema<IEvent> = new Schema<IEvent>({
    productId: {
        type: String,
        // required: true,
        // index: true,
    },
    priceId: {
        type: String,
        // required: true,
    },
    oldPriceIds: {
        type: [String],
        default: [],
    },
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
    price: {
        type: Number,
        required: true,
    },
    oldPrices: {
        type: [Number],
        default: [],
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
        index: "text",
        trim: true,
    },
    organizerId: {
        type: String,
        ref: "User",
        required: true,
    },
    maxAge: {
        type: Number,
    },
    minAge: {
        type: Number,
    },
    maxTickets: {
        type: Number,
    },
    ticketsSold: {
        type: Number,
        default: 0,
    },
    ticketsAvailable: {
        type: Number,
    },
    emergencyContact: {
        type: String,
        required: true,
        trim: true,
    },
    eventType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventType",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

/**
 * @Hooks for eventSchema
 */
eventSchema.pre<IEvent>("save", function (next) {
    this.updated_at = new Date();
    next();
});

/**
 * @Static_Methods for eventSchema
 */

// Fetch all events
eventSchema.statics.fetchEvents = async function (queryParams) {
    const {
        search,
        maxPrice,
        minPrice,
        startAfter,
        endBefore,
        location,
        maxAge,
        minAge,
        createdBefore,
        createdAfter,
    } = queryParams;

    const query: any = {};

    if (search) {
        query["$or"] = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    if (maxPrice) {
        query.price = { ...query.price, $lte: maxPrice };
    }

    if (minPrice) {
        query.price = { ...query.price, $gte: minPrice };
    }

    if (startAfter) {
        query.startTime = { ...query.startTime, $gte: startAfter };
    }

    if (endBefore) {
        query.endTime = { ...query.endTime, $lte: endBefore };
    }

    if (location) {
        query.location = { $regex: location, $options: "i" };
    }

    if (maxAge) {
        query.maxAge = { $lte: maxAge };
    }

    if (minAge) {
        query.minAge = { $gte: minAge };
    }

    if (createdBefore) {
        query.created_at = { ...query.created_at, $lte: createdBefore };
    }

    if (createdAfter) {
        query.created_at = { ...query.created_at, $gte: createdAfter };
    }

    const events: IEvent[] = await this.find(query)
        .populate([
            {
                path: "organizerId",
                select: "-password -__v -created_at -updated_at",
            },
            {
                path: "eventType",
                select: "-__v -created_at -updated_at",
            },
        ])
        .exec();

    return events;
};

// Create an event
eventSchema.statics.createEvent = async function (eventData) {
    // search by event name, location and (startTime or endTime) to check if event already exists
    const { name, location, startTime, endTime } = eventData;

    const event = await this.findOne({
        name,
        location,
        $or: [{ startTime }, { endTime }],
    }).exec();

    if (event) {
        throw new Error("Event already exists");
    }

    const newEvent = await this.create(eventData);

    return newEvent;
};

// Delete an event
eventSchema.statics.deleteEvent = async function (eventId) {};

const Event = mongoose.model<IEvent, IEventModel>("Event", eventSchema);

export default Event;
