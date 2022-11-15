import mongoose from 'mongoose';
import { app } from './app';
import { natsClient } from './nats-client';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined!');
  }
  try {
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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Mongo Db');
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
