
import { TicketAttrs, Ticket } from '../../models'

export async function createTicketInDb(ticketAttrs: TicketAttrs) {
    const {
        title, price, id, version
    } = ticketAttrs
    const ticket = Ticket.build({
        title, price, id, version
    })
    await ticket.save()
    return ticket
}