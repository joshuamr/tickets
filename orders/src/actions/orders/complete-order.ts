import { OrderStatus } from '@microservices-learning-tickets/common';
import { updateOrderInDb } from '../../db/db-actions/orders/update-order-in-db';
import { publishOrderCompleted } from '../../event-bus/publishers/order-completed-publisher';

export async function completeOrder(orderId: string) {
  const completedOrder = await updateOrderInDb({
    id: orderId,
    status: OrderStatus.Complete,
  });

  await publishOrderCompleted({ id: orderId });

  return completedOrder;
}
