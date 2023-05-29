import mongoose, { Schema } from "mongoose";

// importing types
import { IEvent, IEventModel } from "./helpers/types";

export const eventSchema: Schema<IEvent> = new Schema<IEvent>({
    _id: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    productId: {
        type: String,
        required: true,
        index: true,
    },
    priceId: {
        type: String,
        required: true,
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
        trim: true,
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
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
    event_type: {
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
    // TODO: implement fetchEvents
};

// Create an event
eventSchema.statics.createEvent = async function (eventData) {
    // TODO: implement createEvent
};

// Delete an event
eventSchema.statics.deleteEvent = async function (eventId) {};

const Event = mongoose.model<IEvent, IEventModel>("Event", eventSchema);

export default Event;
