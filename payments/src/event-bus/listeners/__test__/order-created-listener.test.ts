import { OrderStatus } from "@microservices-learning-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../db/models/order";
import { natsClient } from "../../nats-client";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString()

    const data = {
        id: orderId,
        ticket: { price: 10, id: new mongoose.Types.ObjectId().toHexString(), },
        status: OrderStatus.Created,
        version: 0,
        expiresAt: new Date().toISOString(),
        userId: 'new user'
    }
    const message = { ack: jest.fn() } as unknown as Message

    return {data, message, orderId}

}

describe('OrderCreatedListener', () => {
    it('creates an order', async () => {
    const { orderId, message, data } = await setup()
    await new OrderCreatedListener(natsClient.client).onMessage(data, message)
        const order = await Order.findById(orderId)
        expect(order).toMatchObject({
            id: orderId,
            status: OrderStatus.Created,
            version: 0,
            price: 10
        })

    })

    it('acks the message', async () => {
        const { message, data } = await setup()
        await new OrderCreatedListener(natsClient.client).onMessage(data, message)
        expect(message.ack).toBeCalled()

    })
})