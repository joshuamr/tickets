import { OrderStatus } from "@microservices-learning-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../db/models/order";
import { natsClient } from "../../nats-client";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        version: 0,
        userId: 'something'
    })

    await order.save()

    const data = {
        id: order.id,
        status: OrderStatus.Canceled,
        version: 1,
        userId: 'something',
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        }
    }

    const message = { ack: jest.fn() } as unknown as Message

    return { message, order, data }

}

describe('OrderCreatedListener', () => {
    it('cancels an order', async () => {
        const { order, message, data } = await setup()
        await new OrderCancelledListener(natsClient.client).onMessage(data, message)
        const orderCancelled = await Order.findById(order.id)
        expect(orderCancelled?.status).toEqual(OrderStatus.Canceled)

    })

    it('acks the message', async () => {
        const { message, data } = await setup()
        await new OrderCancelledListener(natsClient.client).onMessage(data, message)
        expect(message.ack).toBeCalled()

    })
})