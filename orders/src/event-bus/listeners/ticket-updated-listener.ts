import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent } from '@microservices-learning-tickets/common'
import { Ticket } from '../../db/models/ticket'
import { QUEUE_GROUP_NAME } from './queue-group-name'
import { updateTicket } from '../../actions/tickets/update-ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated

    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: TicketUpdatedEvent['data'], message: Message): Promise<void> {
        await updateTicket(data)

        message.ack()
    }
}