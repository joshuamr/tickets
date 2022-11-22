import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsClient } from '../../../event-bus/nats-client'
import mongoose from "mongoose"
import { Message } from 'node-nats-streaming'
import { Ticket } from "../../../db/models"

const setup = async () => {
    // create an instance of the listener
    const ticketUpdatedListener = new TicketUpdatedListener(natsClient.client)
    
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'some title',
        price: 10,
        version: 0,
        id: ticketId,
    })

    await ticket.save()

    // create a fake data event
    const event = {
        title: 'new title',
        price: 20,
        version: 1,
        id: ticketId,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    const message = {ack: jest.fn()} as unknown as Message

    //call the onMessage function with the data object + message object
    return {event, message, ticketUpdatedListener, ticket}
}

describe('TicketUpdatedListener', () => {
    it('throws an error if the ticket is not found', async () => {
        const {event, ticketUpdatedListener, message} = await setup()
        await expect(ticketUpdatedListener.onMessage({...event, id: new mongoose.Types.ObjectId().toHexString()}, message)).rejects.toThrow()
    })
    
    it('updates the ticket', async () => {
        const {event, ticketUpdatedListener, message, ticket} = await setup()
        await ticketUpdatedListener.onMessage(event, message)

        const ticketUpdated = await Ticket.findById(ticket.id)
        expect(ticketUpdated?.price).toEqual(event.price)
        expect(ticketUpdated?.title).toEqual(event.title)
    })

    it('acks the message', async () => {
        const {event, ticketUpdatedListener, message} = await setup()
        await ticketUpdatedListener.onMessage(event, message)
        expect(message.ack).toBeCalled()

    })

    it('does not ack the message if the version is not correct', async () => {
        const {event, ticketUpdatedListener, message} = await setup()
        await expect(ticketUpdatedListener.onMessage({...event, version: event.version + 1}, message)).rejects.toThrow()
        expect(message.ack).not.toBeCalled()

    })
})