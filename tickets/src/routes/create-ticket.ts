import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../db/models/ticket';

import { natsClient } from '../event-bus/nats-client';

import {
  requireAuth,
  validateRequest,
} from '@microservices-learning-tickets/common';

import { TicketCreatedPublisher } from '../event-bus/events/ticket-created-publisher';
import { createTicket } from '../actions/create-ticket';

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

    // because we have validated, we can force the currentUser to be a truthy
    const ticketCreated = await createTicket({title, price, userId: req.currentUser!.id})

    res.status(201).send(ticketCreated);
  }
);
