import express from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';

import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signOutRouter } from './routes/sign-out';
import { signInRouter } from './routes/sign-in';
import { signUpRouter } from './routes/sign-up';

import {
  errorHandler,
  NotFoundError,
} from '@microservices-learning-tickets/common';

const app = express();

// helps nginx know it's secure
app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use('/api/users/current-user', currentUserRouter);
app.use('/api/users/sign-out', signOutRouter);
app.use('/api/users/sign-in', signInRouter);
app.use('/api/users/sign-up', signUpRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
