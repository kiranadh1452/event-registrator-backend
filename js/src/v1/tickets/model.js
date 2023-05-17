import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
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
        enum: ["open", "complete", "expired"],
        default: "open",
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
        enum: ["paid", "unpaid", "no_payment_required"],
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
TicketSchema.pre("save", function (next) {
    const ticket = this;

    // Update the updated_at field
    ticket.updated_at = new Date();

    next();
});

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
