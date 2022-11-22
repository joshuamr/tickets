import { OrderStatus } from "@microservices-learning-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order, Ticket } from "../../../db/models";
import { natsClient } from "../../nats-client";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

async function setup(newStatus: OrderStatus) {
    const ticket = Ticket.build({
        title: 'new ticket',
        price: 20,
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()
    const order =  Order.build({
        status: newStatus,
        userId: 'ramdon',
        ticket,
        expiresAt: new Date()
    })
    await order.save()
    const message = {ack: jest.fn()} as unknown as Message

    return {order, message, ticket}

}
describe('ExpirationCompleteListener', () => {
    it('should throw an error when there is no order found', async () => {
        await expect(new ExpirationCompleteListener(natsClient.client).onMessage({
            orderId: new mongoose.Types.ObjectId().toHexString()
        }, {ack: jest.fn()} as unknown as Message)).rejects.toThrow()
    })

    it('should not update the status if the order is complete', async () => {
        const {order, message} = await setup(OrderStatus.Complete)
        await new ExpirationCompleteListener(natsClient.client).onMessage({
            orderId: order.id
        }, message)
        const orderAfterMessage = await Order.findById(order.id)
        expect(orderAfterMessage?.status).toEqual(OrderStatus.Complete)

    })

    it('should ack the message', async () => {
        const {order, message} = await setup(OrderStatus.Complete)
        await new ExpirationCompleteListener(natsClient.client).onMessage({
            orderId: order.id
        }, message)
        await Order.findById(order.id)
        expect(message.ack).toBeCalled()

    })

    it.each`
    status
    ${OrderStatus.Created}
    ${OrderStatus.AwaitingPayment}
    `('should cancel the order if the order is in status $status', async ({status}) => {
        const {order, message} = await setup(status)
        await new ExpirationCompleteListener(natsClient.client).onMessage({
            orderId: order.id
        }, message)
        const orderAfterMessage = await Order.findById(order.id)
        expect(orderAfterMessage?.status).toEqual(OrderStatus.Canceled)
        
    })
})