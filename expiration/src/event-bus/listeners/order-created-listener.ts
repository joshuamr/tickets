import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@microservices-learning-tickets/common'
import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated

    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCreatedEvent['data'], message: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Waiting this many ms', delay)
        expirationQueue.add({orderId: data.id}, { delay })
        message.ack()
    }
}