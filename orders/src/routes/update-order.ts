import express, { Request, Response } from 'express';
import { body, check } from 'express-validator';

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from '@microservices-learning-tickets/common';

import { natsClient } from '../nats-client';

import { Order } from '../models';

export const updateOrderRouter = express.Router();

updateOrderRouter.patch(
  '/:id',
  requireAuth,
  [
    check('status')
      .isIn([
        OrderStatus.Canceled,
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment,
      ])
      .withMessage('Please send in a valid status.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    order.set({ status });

    await order.save();

    res.status(200).send(order);
  }
);
