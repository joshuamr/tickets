import { Order } from "../../models";

export interface OrderParams {
    userId: string;
}

export async function getOrdersFromDb(orderParams: OrderParams) {
    const orders = await Order.find({
        userId: orderParams.userId
    }).populate('ticket');
    return orders
}