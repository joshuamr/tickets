import express, { Request, Response } from 'express';

import { requireAuth } from '@microservices-learning-tickets/common';
import { getTickets } from '../db/db-actions/get-tickets-from-db';

export const getTicketsRouter = express.Router();

getTicketsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  const tickets = await getTickets({
    userId: req.currentUser?.id,
    orderId: undefined,
  });
  res.status(200).send(tickets);
});
