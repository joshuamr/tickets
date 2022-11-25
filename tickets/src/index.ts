import mongoose from 'mongoose';
import { app } from './app';
import { connectToDb } from './db/connect-to-db';
import { connectToEventBus } from './event-bus/connect-to-event-bus';

const start = async () => {
  console.log('Starting tickets...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }

  try {
    await connectToEventBus();
    await connectToDb();
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
