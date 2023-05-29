import { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
    _id: string;
    productId?: string;
    priceId?: string;
    oldPriceIds: string[];
    name: string;
    description: string;
    price: number;
    oldPrices?: number[];
    startTime: Date;
    endTime: Date;
    location: string;
    organizerId: string;
    maxAge?: number;
    minAge?: number;
    maxTickets?: number;
    ticketsSold: number;
    ticketsAvailable?: number;
    emergencyContact: string;
    eventType?: Schema.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

export interface IEventModel extends Model<IEvent> {
    fetchEvents(queryParams: any): Promise<IEvent[]>;
    createEvent(eventData: any): Promise<IEvent>;
    deleteEvent(eventId: string): Promise<IEvent>;
}
