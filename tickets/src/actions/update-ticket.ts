import { publishTicketUpdatedEvent } from "../event-bus/events/ticket-updated-publisher";
import { updateTicketInDb, TicketUpdates } from "../db/db-actions/update-ticket-in-db";


export async function updateTicket(ticketUpdates: TicketUpdates) {
    const ticket = await updateTicketInDb(ticketUpdates)
    
    await publishTicketUpdatedEvent(ticket)
    return ticket
}