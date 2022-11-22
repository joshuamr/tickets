import { Publisher, Subjects, ExpirationCompleteEvent } from "@microservices-learning-tickets/common";
import { natsClient } from "../nats-client";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}

export const publishExpirationCompleteEvent = (orderId: string) => {
    return new ExpirationCompletePublisher(natsClient.client).publish({ orderId })
}