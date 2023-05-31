import mongoose, { Schema } from "mongoose";

// importing types
import { ITicket, ITicketModel } from "./helpers/types";

export const ticketSchema: Schema<ITicket> = new Schema<ITicket>({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    type: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["open", "complete", "expired"],
        default: "open",
    },
    sessionId: {
        type: String,
        required: true,
        index: true,
    },
    totalAmount: {
        type: Number,
    },
    sessionCreated: {
        type: Date,
    },
    currency: {
        type: String,
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
        index: true,
    },
    priceId: {
        type: String,
        index: true,
        required: true,
    },
    paymentIntent: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid", "no_payment_required"],
        required: true,
        default: "unpaid",
    },
    sessionUrl: {
        type: String,
    },
    amountShipping: {
        type: Number,
    },
    amountDiscount: {
        type: Number,
    },
    amountTax: {
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

/**
 * @Hooks for ticketSchema
 */
ticketSchema.pre<ITicket>("save", function (next) {
    this.updated_at = new Date();
    next();
});

// Methods for ticketSchema
ticketSchema.methods.updateTicket = async function (
    this: ITicket,
    updateProps: Partial<ITicket>
): Promise<ITicket> {
    //TODO: implement this
    return this;
};

/**
 * @Static_Methods
 */
ticketSchema.statics.fetchTickets = async function (
    queryParams: any
): Promise<ITicket[]> {
    const { userId, eventId, oraganizerId, type, ticketStatus, paymentStatus } =
        queryParams;

    const query: any = {};

    // formulate query with the given params
    {
        if (userId) {
            query.userId = userId;
        }

        if (eventId) {
            query.eventId = eventId;
        }

        if (oraganizerId) {
            query.oraganizerId = oraganizerId;
        }

        if (type) {
            query.type = type;
        }

        if (ticketStatus) {
            query.ticketStatus = ticketStatus;
        }
    }

    const tickets: ITicket[] = await this.find(query, {
        __v: 0,
    });

    return tickets;
};

ticketSchema.statics.createTicket = async function (
    ticketData: any
): Promise<ITicket> {
    // TODO: Implement this
    return ticketData as ITicket;
};

ticketSchema.statics.deleteTicket = async function (
    ticketId: string
): Promise<boolean> {
    // TODO: Implement this
    return false;
};

const Ticket = mongoose.model<ITicket, ITicketModel>("Ticket", ticketSchema);

export default Ticket;
