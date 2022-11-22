import { TicketAttrs, Ticket } from "../../models"

export async function updateTicketInDb(ticketAttrs: TicketAttrs) {
     // confirms we are finding the correct previous version
     const ticket = await Ticket.findByEvent(ticketAttrs)

     if (!ticket) {
         throw new Error('Ticket not found.')
     }
     const {title, price} = ticketAttrs
     ticket.set({title, price})
     await ticket.save()
     return ticket
}