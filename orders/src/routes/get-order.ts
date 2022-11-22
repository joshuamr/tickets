import express, { Request, Response } from 'express';

import {
  requireAuth,
  NotFoundError,
  UnauthorizedError,
} from '@microservices-learning-tickets/common';

import { getOrder } from '../actions/orders/get-order';

export const getOrderRouter = express.Router();

getOrderRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await getOrder(id)

  if (order.userId !== req.currentUser!.id) {
    throw new UnauthorizedError();
  }

  res.status(200).send(order);
});
