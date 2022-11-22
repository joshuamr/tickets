import { Listener, Subjects, ExpirationCompleteEvent, NotFoundError, OrderStatus } from "@microservices-learning-tickets/common";
import { Message } from "node-nats-streaming";
import { cancelOrder } from "../../actions/orders/cancel-order";
import { getOrder } from "../../actions/orders/get-order";
import { handleOrderExpired } from "../../actions/orders/handle-order-expired";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete

    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: ExpirationCompleteEvent['data'], message: Message) {
        const { orderId } = data

        await handleOrderExpired(orderId)

        message.ack()

    }
}