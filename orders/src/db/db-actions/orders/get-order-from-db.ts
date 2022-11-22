import { NotFoundError } from "@microservices-learning-tickets/common";
import { Order } from "../../models";

export async function getOrderFromDb(id: string) {
  const order = await Order.findById(id).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  return order

}