import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';

import { natsClient } from '../nats-client';

import {
  requireAuth,
  validateRequest,
} from '@microservices-learning-tickets/common';

import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

export const createTicketRouter = express.Router();

createTicketRouter.post(
  '/',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('A title is required.'),
    body('price').isFloat({ gt: 0 }).withMessage('A valid price is required.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // using force because we know the middleware validated the current user
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });

    await ticket.save();

    new TicketCreatedPublisher(natsClient.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);
