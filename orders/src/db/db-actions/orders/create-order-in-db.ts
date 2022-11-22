import { NotFoundError, OrderStatus } from "@microservices-learning-tickets/common";
import { Order, Ticket } from "../../models";

export async function createOrderInDb({userId, expiresAt, ticketId}: 
    {userId: string; expiresAt: Date; ticketId: string}
    ) {
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
        throw new NotFoundError()
    }

    // build the order and save it to the dbs
    const order = Order.build({
      userId,
      status: OrderStatus.Created,
      expiresAt,
    // @ts-ignore
      ticket,
    });

    await order.save();

    return order

}