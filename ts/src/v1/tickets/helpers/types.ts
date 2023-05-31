import { Document, Model, Schema } from "mongoose";

export interface ITicket extends Document {
    _id: string;
    eventId: Schema.Types.ObjectId;
    organizerId: string;
    quantity?: number;
    type?: string;
    status?: "open" | "complete" | "expired";
    sessionId: string;
    totalAmount?: number;
    sessionCreated?: Date;
    currency?: string;
    userId: string; // we are using the firebase id, so not an objectId here
    priceId: string;
    paymentIntent?: string;
    paymentStatus?: "paid" | "unpaid" | "no_payment_required";
    sessionUrl?: string;
    amountShipping?: number;
    amountDiscount?: number;
    amountTax?: number;
    created_at?: Date;
    updated_at?: Date;
    updateTicket: (
        this: ITicket,
        updateProps: Partial<ITicket>
    ) => Promise<ITicket>;
}

export interface ITicketModel extends Model<ITicket> {
    fetchTickets(queryParams: any): Promise<ITicket[]>;
    createTicket(ticketData: any): Promise<ITicket>;
    deleteTicket(ticketId: string): Promise<ITicket>;
}
