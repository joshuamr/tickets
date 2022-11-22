import { Listener, OrderCancelledEvent, Subjects } from '@microservices-learning-tickets/common'
import { QUEUE_GROUP_NAME } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { updateTicket } from '../../actions/update-ticket'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled

    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCancelledEvent['data'], message: Message) {
        await updateTicket({id: data.ticket.id, orderId: undefined})

        message.ack()
    }
}