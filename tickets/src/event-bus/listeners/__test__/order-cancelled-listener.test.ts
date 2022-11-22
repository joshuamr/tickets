import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsClient } from '../../nats-client'
import mongoose from 'mongoose'
import { Ticket } from '../../../db/models/ticket'

async function setup() {
    const orderCancelledListener = new OrderCancelledListener(natsClient.client)
    const userId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        price: 10,
        title: 'new ticket',
        userId,
        orderId: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const event = {
        ticket: {id: ticket.id, userId},
    } as unknown as any

    const message = {ack: jest.fn()} as unknown as any

    return { event, message, orderId, ticket, orderCancelledListener}
}
describe('OrderCreatedListener', () => {
    it('should fail when no ticket found', async () => {
        const orderCancelledListener = new OrderCancelledListener(natsClient.client)
        await expect(orderCancelledListener.onMessage({
            ticket: {id: new mongoose.Types.ObjectId().toHexString()},
        } as unknown as any, {ack: jest.fn()} as unknown as any)).rejects.toThrow()
    })
    it('should remove the order Id from the ticket', async () => {
        const { event, message, ticket, orderCancelledListener} = await setup()
        await orderCancelledListener.onMessage(event, message)

        const ticketInDb = await Ticket.findById(ticket.id)
        expect(ticketInDb?.orderId).toEqual(undefined)
    })
    it('should ack the message', async () => {
        const { event, message, ticket, orderCancelledListener} = await setup()
        await orderCancelledListener.onMessage(event, message)
        expect(message.ack).toBeCalled()
    })
    it('should publish an event', async () => {
        const { event, message, orderCancelledListener} = await setup()
        await orderCancelledListener.onMessage(event, message)

        expect(natsClient.client.publish).toBeCalled()
        
        const ticketUpdatedData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[0][1])

        expect(ticketUpdatedData.orderId).toEqual(undefined)
    })
})