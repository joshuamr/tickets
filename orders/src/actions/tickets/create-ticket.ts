import { createTicketInDb } from "../../db/db-actions/tickets/create-ticket-in-db";
import { TicketAttrs } from "../../db/models";

export async function createTicket(ticketAttrs: TicketAttrs) {
    return createTicketInDb(ticketAttrs)
}