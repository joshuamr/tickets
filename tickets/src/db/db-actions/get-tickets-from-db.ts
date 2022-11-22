import { Ticket } from "../models/ticket";

interface TicketParams  {
    title?: string;
    price?: number;
    orderId?: string;
    userId?: string;
}

export async function getTickets(ticketParams: TicketParams) {
    return Ticket.find(ticketParams)
}