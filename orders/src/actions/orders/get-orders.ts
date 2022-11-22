import { getOrdersFromDb, OrderParams } from "../../db/db-actions/orders/get-orders-from-db";

export function getOrders(orderParams: OrderParams) {
    return getOrdersFromDb(orderParams)
}