import express, { Request, Response } from 'express';

import {
  requireAuth,
  NotFoundError,
} from '@microservices-learning-tickets/common';
import { Order } from '../models';

export const getOrdersRouter = express.Router();

getOrdersRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.status(200).send(orders);
});
