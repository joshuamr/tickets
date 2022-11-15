import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket, Order } from '../models';

import { natsClient } from '../nats-client';

// 15 minutes * 60 seconds
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@microservices-learning-tickets/common';

export const createOrderRouter = express.Router();

createOrderRouter.post(
  '/',
  requireAuth,
  [body('ticketId').trim().notEmpty().withMessage('A ticket id is required.')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the db

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved.');
    }

    // Calculate an exp date for the order

    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the dbs
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // publish an event saying that an order was created

    res.status(201).send(order);
  }
);
