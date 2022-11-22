import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from '@microservices-learning-tickets/common';
import { PaymentAttrs } from '../../db/models/payment';
import { natsClient } from '../nats-client';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

export function publishPaymentCreatedEvent(
  payment: PaymentAttrs & { id: string }
) {
  return new PaymentCreatedPublisher(natsClient.client).publish(payment);
}
