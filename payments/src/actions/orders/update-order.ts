import {
  OrderUpdateAttrs,
  updateOrderInDb,
} from '../../db/db-actions/orders/update-order-in-db';

export function updateOrder(orderUpdates: OrderUpdateAttrs) {
  return updateOrderInDb(orderUpdates);
}
