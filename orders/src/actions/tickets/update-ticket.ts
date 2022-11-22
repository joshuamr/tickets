import { updateTicketInDb } from "../../db/db-actions/tickets/update-ticket-in-db";
import { TicketAttrs } from "../../db/models";

export async function updateTicket(ticketAttrs: TicketAttrs) {
    return updateTicketInDb(ticketAttrs)
}