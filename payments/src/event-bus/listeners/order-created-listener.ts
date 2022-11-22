import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@microservices-learning-tickets/common';
import { Message } from 'node-nats-streaming';
import { createOrder } from '../../actions/orders/create-order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    await createOrder({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    message.ack();
  }
}
