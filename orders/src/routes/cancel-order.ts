import express, { Request, Response } from 'express';

import {
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from '@microservices-learning-tickets/common';
import { cancelOrder } from '../actions/orders/cancel-order';
import { getOrder } from '../actions/orders/get-order';

export const deleteOrderRouter = express.Router();

deleteOrderRouter.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await getOrder(id) 
    
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    const cancelledOrder = await cancelOrder(id)
    res.status(200).send(cancelledOrder);
  }
);
