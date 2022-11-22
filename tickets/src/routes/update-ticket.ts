import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  requireAuth,
  validateRequest,
  UnauthorizedError,
  BadRequestError,
} from '@microservices-learning-tickets/common';
import { updateTicket } from '../actions/update-ticket';
import { getTicket } from '../db/db-actions/get-ticket-from-db';

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

    // get the ticket to validate it is for the current user
    const ticket = await getTicket(id)

    if (ticket.userId !== req.currentUser?.id) {
      throw new UnauthorizedError()
    }

    // if the ticket is associated with an order, we do not allow updates
    if (ticket.orderId) {
      throw new BadRequestError('Ticket is reserved and cannot be updated.')
    }

    // update the ticket
    const updatedTicket = await updateTicket({title, price, id})

    res.status(200).send(updatedTicket);
  }
);
