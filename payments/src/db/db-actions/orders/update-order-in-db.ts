import {
  NotFoundError,
  OrderStatus,
} from '@microservices-learning-tickets/common';
import { Order } from '../../models/order';

interface BaseOrderAttrs {
  id: string;
  status?: OrderStatus;
  price?: number;
  userId?: string;
}

export type OrderUpdateAttrs = BaseOrderAttrs & {
  version: number;
};

type OrderUpdatesTransformed = BaseOrderAttrs & {
  version?: number;
};

export async function updateOrderInDb(orderAttrs: OrderUpdateAttrs) {
  const order = await Order.findOne({
    id: orderAttrs.id,
    version: orderAttrs.version - 1,
  });

  if (!order) {
    throw new NotFoundError();
  }

  const orderUpdates: OrderUpdatesTransformed = { ...orderAttrs };
  delete orderUpdates.version;

  order?.set(orderUpdates);
  await order?.save();
  return order;
}
