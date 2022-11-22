import { TicketCreatedListener } from "../ticket-created-listener"
import { natsClient } from '../../../event-bus/nats-client'
import mongoose from "mongoose"
import { Message } from 'node-nats-streaming'
import { Ticket } from "../../../db/models"

const setup = async () => {
    // create an instance of the listener
    const ticketCreatedListener = new TicketCreatedListener(natsClient.client)
    
    // create a fake data event
    const event = {
        title: 'some title',
        price: 10,
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    const message = {ack: jest.fn()} as unknown as Message

    //call the onMessage function with the data object + message object
    return {event, message, ticketCreatedListener}
}

describe('TicketCreatedListener', () => {
    it('creates and saves a ticket', async () => {
        const {event, ticketCreatedListener, message} = await setup()
        await ticketCreatedListener.onMessage(event, message)

        // make sure a ticket was created.
        const ticket = await Ticket.findById(event.id)
        expect(ticket).toBeTruthy()
    })

    it('acks the message', async () => {
        const {event, ticketCreatedListener, message} = await setup()
        await ticketCreatedListener.onMessage(event, message)

        // make sure ack was called
        expect(message.ack).toBeCalled()

    })
})