import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@microservices-learning-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
