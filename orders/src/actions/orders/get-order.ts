import { getOrderFromDb } from "../../db/db-actions/orders/get-order-from-db";

export function getOrder(orderId: string) {
    return getOrderFromDb(orderId)
}