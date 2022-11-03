import { Publisher, Subjects, TicketCreatedEvent } from '@microservices-learning-tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}