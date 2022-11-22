import { Listener, OrderCreatedEvent, Subjects } from '@microservices-learning-tickets/common'
import { QUEUE_GROUP_NAME } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { updateTicket } from '../../actions/update-ticket'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated

    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        await updateTicket({id: data.ticket.id, orderId: data.id})

        message.ack()
    }
}