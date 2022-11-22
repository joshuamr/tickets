import mongoose from 'mongoose'

import { OrderStatus, Order } from './order'

import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface BaseTicketAttrs {
    title: string;
    price: number;
    version: number;
}
export type TicketAttrs = BaseTicketAttrs & {
    id: string;
}

type TicketAttrsTransformed = BaseTicketAttrs & {
    _id: string;
    // we pull off id
    id?: string;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;

    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
    findByEvent(event: {id: string; version: number}): Promise<TicketDoc | null>
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

ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.set('versionKey', 'version')

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    const attrsIntermediary: TicketAttrsTransformed = {
        ...attrs,
        _id: attrs.id
    }

    delete attrsIntermediary.id
    return new Ticket(attrsIntermediary)
}

ticketSchema.statics.findByEvent = ({id, version}: {id: string; version: number}) => {
  return Ticket.findOne({
    _id: id,
    version: version - 1
   })
}

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
