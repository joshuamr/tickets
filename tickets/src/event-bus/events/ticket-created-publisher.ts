import { Publisher, Subjects, TicketCreatedEvent } from '@microservices-learning-tickets/common'
import { TicketDoc } from '../../db/models/ticket';
import { natsClient } from '../nats-client';
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}

export function publishTicketCreatedEvent(ticket: TicketDoc) {
    return new TicketCreatedPublisher(natsClient.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version
    });
}