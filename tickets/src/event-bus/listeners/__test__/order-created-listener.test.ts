import { OrderCreatedListener } from '../order-created-listener'
import { natsClient } from '../../nats-client'
import mongoose from 'mongoose'
import { Ticket } from '../../../db/models/ticket'

async function setup() {
    const orderCreatedListener = new OrderCreatedListener(natsClient.client)
    const userId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        price: 10,
        title: 'new ticket',
        userId
    })
    await ticket.save()

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const event = {
        id: orderId,
        ticket: {id: ticket.id, userId},
        userId
    } as unknown as any

    const message = {ack: jest.fn()} as unknown as any

    return { event, message, orderId, ticket, orderCreatedListener}
}
describe('OrderCreatedListener', () => {
    it('should fail when no ticket found', async () => {
        const orderCreatedListener = new OrderCreatedListener(natsClient.client)
        await expect(orderCreatedListener.onMessage({
            ticket: {id: new mongoose.Types.ObjectId().toHexString()},
        } as unknown as any, {ack: jest.fn()} as unknown as any)).rejects.toThrow()
    })
    it('should set the order Id on the ticket', async () => {
        const { event, message, orderId, ticket, orderCreatedListener} = await setup()
        await orderCreatedListener.onMessage(event, message)

        const ticketInDb = await Ticket.findById(ticket.id)
        expect(ticketInDb?.orderId).toEqual(orderId)
    })
    it('should ack the message', async () => {
        const { event, message, orderId, ticket, orderCreatedListener} = await setup()
        await orderCreatedListener.onMessage(event, message)

        await Ticket.findById(ticket.id)
        expect(message.ack).toBeCalled()
    })
    it('should publish an event', async () => {
        const { event, message, orderCreatedListener} = await setup()
        await orderCreatedListener.onMessage(event, message)

        expect(natsClient.client.publish).toBeCalled()
        
        const ticketUpdatedData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[0][1])

        expect(ticketUpdatedData.orderId).toEqual(event.id)
    })
})