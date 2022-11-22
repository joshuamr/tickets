import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@microservices-learning-tickets/common'
import { Ticket } from '../../db/models/ticket'
import { QUEUE_GROUP_NAME } from './queue-group-name'
import { createTicket } from '../../actions/tickets/create-ticket'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated

    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data:TicketCreatedEvent['data'], message: Message): Promise<void> {
        await createTicket(data)
        message.ack()
    }
}