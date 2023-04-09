import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["created", "opened", "expired", "canceled", "completed"],
            default: "created",
        },
        sessionId: {
            type: String,
            index: true,
        },
        total_amount: {
            type: Number,
        },
        session_created: {
            type: Date,
        },
        currency: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        priceId: {
            type: String,
            index: true,
        },
        payment_intent: {
            type: String,
        },
        payment_status: {
            type: String,
            enum: ["succeeded", "failed", "canceled"],
        },
        session_url: {
            type: String,
        },
        amount_shipping: {
            type: Number,
        },
        amount_discount: {
            type: Number,
        },
        amount_tax: {
            type: Number,
        },
    },
    { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
