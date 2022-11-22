import { getTicket } from "./get-ticket-from-db";

export interface TicketUpdates {
    title?: string;
    price?: number;
    orderId?: string | null;
    id: string,
}

export async function updateTicketInDb(ticketUpdates: TicketUpdates) {
    const ticket = await getTicket(ticketUpdates.id)
    ticket.set(ticketUpdates);

    await ticket.save();
    return ticket
}