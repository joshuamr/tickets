import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@microservices-learning-tickets/common';
import { Message } from 'node-nats-streaming';
import { updateOrder } from '../../actions/orders/update-order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent['data'], message: Message) {
    await updateOrder({
      id: data.id,
      status: OrderStatus.Canceled,
      version: data.version,
    });

    message.ack();
  }
}
