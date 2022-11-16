import express, { Request, Response } from 'express';

import {
  requireAuth,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from '@microservices-learning-tickets/common';

import { Order } from '../models';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

import { natsClient } from '../nats-client';

export const deleteOrderRouter = express.Router();

deleteOrderRouter.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    order.set({ status: OrderStatus.Canceled });
    // using force because we know the middleware validated the current user

     // publish an event saying that an order was created
     new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      ticket: {
       id: order.ticket.id,
      } 
     })
    res.status(200).send(order);
  }
);
