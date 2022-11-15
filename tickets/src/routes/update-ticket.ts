import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  UnauthorizedError,
} from '@microservices-learning-tickets/common';

import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

import { natsClient } from '../nats-client';

export const updateTicketRouter = express.Router();

updateTicketRouter.patch(
  '/:id',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('A title is required.'),
    body('price').isFloat({ gt: 0 }).withMessage('A valid price is required.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.params;

    // using force because we know the middleware validated the current user
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    ticket.set({ title, price });
    await ticket.save();

    new TicketUpdatedPublisher(natsClient.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);
