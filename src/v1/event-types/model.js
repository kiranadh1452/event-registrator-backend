import mongoose from "mongoose";

const eventTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: "text",
    },
    description: {
        type: String,
        required: true,
        index: "text",
    },
    created_by: {
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
});

// hooks to update the updated_at field
eventTypeSchema.pre("save", function (next) {
    const eventType = this;

    // Update the updated_at field
    eventType.updated_at = new Date();

    next();
});

const EventType = mongoose.model("EventType", eventTypeSchema);

export default EventType;
