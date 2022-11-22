import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { getOrder } from '../../../actions/orders/get-order';
import { Order, OrderStatus, Ticket } from '../../../db/models';
import { natsClient } from '../../nats-client';
import { PaymentCreatedListener } from '../payment-created-listener';

const setup = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'new ticket',
    price: 10,
    version: 0,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'random',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const eventData = {
    id: new mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
    stripeId: new mongoose.Types.ObjectId().toHexString(),
  };

  const message = {
    ack: jest.fn(),
  } as unknown as Message;

  return { eventData, order, ticket, message };
};

describe('PaymentCreatedListener', () => {
  it('should throw when the order is not found', async () => {
    await expect(
      new PaymentCreatedListener(natsClient.client).onMessage(
        {
          orderId: new mongoose.Types.ObjectId().toHexString(),
        } as unknown as any,
        {} as unknown as Message
      )
    ).rejects.toThrow();
  });
  it('should set the order to completed', async () => {
    const { eventData, order, ticket, message } = await setup();
    await new PaymentCreatedListener(natsClient.client).onMessage(
      eventData,
      message
    );
    const completedOrder = await getOrder(order.id);

    expect(completedOrder.status).toEqual(OrderStatus.Complete);
  });
  it('should ack the message', async () => {
    const { eventData, order, ticket, message } = await setup();
    await new PaymentCreatedListener(natsClient.client).onMessage(
      eventData,
      message
    );
    expect(message.ack).toBeCalled();
  });
  it('should publish an event', async () => {
    const { eventData, order, ticket, message } = await setup();
    await new PaymentCreatedListener(natsClient.client).onMessage(
      eventData,
      message
    );
    expect(natsClient.client.publish).toBeCalled();
  });
});
