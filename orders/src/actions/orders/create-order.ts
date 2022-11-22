import { BadRequestError } from '@microservices-learning-tickets/common';
import { createOrderInDb } from '../../db/db-actions/orders/create-order-in-db';
import { publishOrderCreated } from '../../event-bus/publishers/order-created-publisher';
import { getTicket } from '../tickets/get-ticket';

// 15 minutes * 60 seconds
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

export async function createOrder({
  ticketId,
  userId,
}: {
  ticketId: string;
  userId: string;
}) {
  const ticket = await getTicket(ticketId);

  // note:  I find this hacky--should be a custom method
  const isReserved = await ticket.isReserved();

  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved.');
  }

  // Calculate an exp date for the order

  const expiresAt = new Date();

  expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = await createOrderInDb({ userId, ticketId, expiresAt });

  await publishOrderCreated({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    version: order.version,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  return order;
}
