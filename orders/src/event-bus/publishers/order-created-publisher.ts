import { Publisher, OrderCreatedEvent, Subjects, OrderStatus } from "@microservices-learning-tickets/common";
import { natsClient } from "../nats-client";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}

interface OrderPublishedParams {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    version: number;
    ticket: {
        id: string;
        price: number;
    } 
}

export function publishOrderCreated(orderPublishedParams: OrderPublishedParams) {
    // publish an event saying that an order was created
    return new OrderCreatedPublisher(natsClient.client).publish(orderPublishedParams)
}