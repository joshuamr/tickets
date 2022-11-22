import { Publisher, OrderCancelledEvent, Subjects } from "@microservices-learning-tickets/common";
import { natsClient } from "../nats-client";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}

interface OrderCancelledMessage{
    id: string;
    version: number;
    ticket: {
     id: string;
    } 
   }

export function publishOrderCancelled(orderCancelledMessage: OrderCancelledMessage) {
    console.log('order cancelled')

    // publish an event saying that an order was created
    new OrderCancelledPublisher(natsClient.client).publish(orderCancelledMessage)

}