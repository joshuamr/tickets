import {
  Publisher,
  OrderCompletedEvent,
  Subjects,
} from '@microservices-learning-tickets/common';
import { natsClient } from '../nats-client';

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
}

export const publishOrderCompleted = (data: { id: string }) => {
  return new OrderCompletedPublisher(natsClient.client).publish(data);
};
