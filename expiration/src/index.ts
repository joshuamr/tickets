import { connectToEventBus } from './event-bus/connect-to-event-bus';

const start = async () => {
  try {
    await connectToEventBus()

  } catch (e) {
    console.error(e);
  }
};

start();
