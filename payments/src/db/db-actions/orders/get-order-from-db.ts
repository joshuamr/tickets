import { Order } from '../../models/order';

export async function getOrderFromDb(orderId: string) {
  const order = Order.findById(orderId);

  return order;
}
