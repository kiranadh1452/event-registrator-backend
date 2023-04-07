import mongoose from "mongoose";

const eventTypeSchema = new mongoose.Schema(
    {
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
    },
    { timestamps: true }
);

const EventType = mongoose.model("EventType", eventTypeSchema);

export default EventType;
