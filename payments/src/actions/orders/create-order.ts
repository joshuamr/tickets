import { createOrderInDb } from '../../db/db-actions/orders/create-order-in-db';
import { OrderAttrs } from '../../db/models/order';

export function createOrder(orderAttrs: OrderAttrs) {
  return createOrderInDb(orderAttrs);
}
