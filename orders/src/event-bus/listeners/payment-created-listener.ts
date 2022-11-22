import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
} from '@microservices-learning-tickets/common';
import { Message } from 'node-nats-streaming';
import { completeOrder } from '../../actions/orders/complete-order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: { id: string; orderId: string; stripeId: string },
    message: Message
  ): Promise<void> {
    await completeOrder(data.orderId);
    message.ack();
  }
}
