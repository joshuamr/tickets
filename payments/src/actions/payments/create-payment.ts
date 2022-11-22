import {
  BadRequestError,
  OrderStatus,
} from '@microservices-learning-tickets/common';
import { getOrder } from '../orders/get-order';

import { createCharge } from '../../charge/create-charge';
import { createPaymentInDb } from '../../db/db-actions/payments/create-payment-in-db';
import { publishPaymentCreatedEvent } from '../../event-bus/publishers/payment-created-publisher';

export async function createPayment(orderId: string, token: string) {
  const order = await getOrder(orderId);

  if (order.status === OrderStatus.Canceled) {
    throw new BadRequestError('Order is cancelled and cannot accept payments.');
  }

  const charge = await createCharge({
    token,
    amount: order.price,
  });

  const payment = await createPaymentInDb({
    orderId: order.id,
    stripeId: charge.id,
  });

  await publishPaymentCreatedEvent({ ...payment, id: payment.id || '' });

  return payment;
}
