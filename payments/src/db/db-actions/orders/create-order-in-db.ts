import { Order, OrderAttrs } from '../../models/order';

export async function createOrderInDb(orderAttrs: OrderAttrs) {
  const order = Order.build(orderAttrs);

  await order.save();

  return order;
}
