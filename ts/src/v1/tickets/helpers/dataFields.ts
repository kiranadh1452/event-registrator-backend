import { ticketSchema } from "../model";

const ignoreTheseFields = ["_id", "created_at", "updated_at"];

// compulsory fields for creating a new ticket - we only need the event id and price id data.
// Other data are dependent on stripe response and will be updated in backend.
export const TicketCreationRequirements = [
    "eventId",
    // "priceId", for now, the event has only one price so we don't need this
    // "quantity", for now, it is default to 1
    // "type", for now, it is default to "general"
    // "currency", for now, it is default to "usd"
];

export const TicketQueryFields = [
    "userId",
    "eventId",
    "oraganizerId",
    "type",
    "status",
    "paymentStatus",
];

export const AllFieldsInEventType = Object.keys(ticketSchema.obj);
