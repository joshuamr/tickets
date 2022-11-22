import { getTicketFromDb } from "../../db/db-actions/tickets/get-ticket-from-db";

export function getTicket(ticketId: string) {
    return getTicketFromDb(ticketId)
}