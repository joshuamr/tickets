import { NotFoundError, OrderStatus } from "@microservices-learning-tickets/common"
import { cancelOrder } from "./cancel-order"
import { getOrder } from "./get-order"

export async function handleOrderExpired(orderId: string) {
    const order = await getOrder(orderId)

    if (!order) {
        throw new NotFoundError()
    }

    if (![OrderStatus.Complete, OrderStatus.Canceled].includes(order.status)) {
        await cancelOrder(order.id)
    }
    return order
}