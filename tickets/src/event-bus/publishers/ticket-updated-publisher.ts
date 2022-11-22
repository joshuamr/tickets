import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@microservices-learning-tickets/common';
import { TicketDoc } from '../../db/models/ticket';
import { natsClient } from '../nats-client';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

export function publishTicketUpdatedEvent(ticket: TicketDoc) {
  debugger;
  return new TicketUpdatedPublisher(natsClient.client).publish({
    id: ticket.id,
    price: ticket.price,
    title: ticket.title,
    userId: ticket.userId,
    version: ticket.version
  });

}
