import express, { Request, Response } from 'express';

import {
  requireAuth,
} from '@microservices-learning-tickets/common';
import { getOrders } from '../actions/orders/get-orders';

export const getOrdersRouter = express.Router();

getOrdersRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  const orders = await getOrders({userId: req.currentUser!.id})

  res.status(200).send(orders);
});
