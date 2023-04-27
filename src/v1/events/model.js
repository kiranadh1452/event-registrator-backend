import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
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
        index: "text",
    },
    price: {
        type: Number,
        required: true,
    },
    start_time: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v > new Date();
            },
        },
    },
    end_time: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v > new Date();
            },
        },
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    max_age: {
        type: Number,
    },
    min_age: {
        type: Number,
    },
    emergency_contact: {
        type: String,
    },
    event_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventType",
    },
});

// hooks for updating the updated_at field
eventSchema.pre("save", function (next) {
    const event = this;

    // Update the updated_at field
    event.updated_at = new Date();

    next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
