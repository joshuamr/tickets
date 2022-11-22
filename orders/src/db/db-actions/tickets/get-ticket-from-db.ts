import { NotFoundError } from "@microservices-learning-tickets/common";
import { Ticket } from "../../models";

export async function getTicketFromDb(ticketId: string) {
    // Find the ticket the user is trying to order in the db
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }
    return ticket
}