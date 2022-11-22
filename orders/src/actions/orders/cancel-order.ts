import { OrderStatus } from '@microservices-learning-tickets/common';
import { updateOrderInDb } from '../../db/db-actions/orders/update-order-in-db';
import { publishOrderCancelled } from '../../event-bus/publishers/order-cancelled-publisher';

export async function cancelOrder(orderId: string) {
  const cancelledOrder = await updateOrderInDb({
    id: orderId,
    status: OrderStatus.Canceled,
  });

  await publishOrderCancelled({
    id: cancelledOrder.id,
    version: cancelledOrder.version,
    ticket: {
      id: cancelledOrder.ticket.id,
    },
  });

  return cancelledOrder;
}
