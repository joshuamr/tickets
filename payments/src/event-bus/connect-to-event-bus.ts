
import { natsClient } from './nats-client';
import { OrderCancelledListener, OrderCreatedListener } from './listeners/';

export async function connectToEventBus() {
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined!');
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined!');
    }
    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined!');
    }

    // first argument is clusterId, which is specified in nats-depl.yaml as the -cid param
    // second argumentis clientId
    // third argument is using the service from nats-depl with its port for client
    await natsClient.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
  
      natsClient.client.on('close', () => {
        console.log('NATS connection closed!');
        // if we don't have the client, we can't run anything else
        process.exit();
      });
      process.on('SIGINT', () => natsClient.client.close());
      process.on('SIGTERM', () => natsClient.client.close());

      new OrderCancelledListener(natsClient.client).listen()
      new OrderCreatedListener(natsClient.client).listen()
} 