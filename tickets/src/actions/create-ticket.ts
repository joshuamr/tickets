import { publishTicketCreatedEvent, TicketCreatedPublisher } from "../event-bus/events/ticket-created-publisher";

import { insertTicketToDb, CreateTicketParams } from "../db/db-actions/insert-ticket-to-db";


export async function createTicket(ticketParams: CreateTicketParams) {
    const ticket = await insertTicketToDb(ticketParams)

    await publishTicketCreatedEvent(ticket)

    return ticket
}