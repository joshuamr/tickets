import Queue from 'bull';
import { publishExpirationCompleteEvent } from '../event-bus/publishers/expiration-complete-publisher'

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    console.log('job', job.data.orderId)
    await publishExpirationCompleteEvent(job.data.orderId)
})

export { expirationQueue }