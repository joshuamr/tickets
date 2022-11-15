import mongoose from 'mongoose'

import { OrderStatus, Order } from './order'

interface TicketAttrs {
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;

    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs)

ticketSchema.methods.isReserved = async function() {
    // Make sure this ticket is not already reserved
    // Run query to look at all orders.
    // is the ticket we just found *and* the order's status
    // is not canceled.
    // if we find an order for this, the ticket is reserved.

    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
          $in: [
            OrderStatus.Created,
            OrderStatus.AwaitingPayment,
            OrderStatus.Complete
          ]
        }
      })

      return !!existingOrder
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)
