import { Document, Model, Schema } from "mongoose";

export interface IEventType extends Document {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    created_at: Date;
    updated_at: Date;
}

export interface IEventTypeModel extends Model<IEventType> {
    fetchEventTypes(queryParams: any): Promise<IEventType[]>;
    createEventType(eventTypeData: any): Promise<IEventType>;
    deleteEventType(eventTypeId: string): Promise<IEventType>;
}
