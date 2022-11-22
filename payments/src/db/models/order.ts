import { OrderStatus } from "@microservices-learning-tickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export interface OrderAttrs {
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderTransformedAttrs {
    id?: string | undefined;
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
    _id: string | undefined;

}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const OrderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret.id
        }
    }
})

OrderSchema.set('versionKey', 'version')
OrderSchema.plugin(updateIfCurrentPlugin)

OrderSchema.statics.build = (orderAttrs: OrderTransformedAttrs) => {
    const orderAttrsTransformed: OrderTransformedAttrs = {
        ...orderAttrs,
        _id: orderAttrs.id
    }
    delete orderAttrsTransformed.id
    return new Order(orderAttrsTransformed)
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema)

