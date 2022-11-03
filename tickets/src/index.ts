import mongoose from 'mongoose';
import { app } from './app';
import { natsClient } from './nats.client';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }
  try {
    // first argument is clusterId, which is specified in nats-depl.yaml as the -cid param
    // second argumentis clientId
    // third argument is using the service from nats-depl with its port for client
    await natsClient.connect('ticketing', 'random', 'http://nats-srv:4222');
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
