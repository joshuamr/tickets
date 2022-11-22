import { NotFoundError } from '@microservices-learning-tickets/common';
import { getOrderFromDb } from '../../db/db-actions/orders/get-order-from-db';

export async function getOrder(orderId: string) {
  const order = await getOrderFromDb(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  return order;
}
