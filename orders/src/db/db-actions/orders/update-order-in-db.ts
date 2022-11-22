import { getOrderFromDb } from './get-order-from-db';

export async function updateOrderInDb({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const order = await getOrderFromDb(id);

  order.set({ status });

  await order.save();

  return order;
}
