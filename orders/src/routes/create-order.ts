import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket, Order } from '../db/models';


import {
  requireAuth,
  validateRequest,
} from '@microservices-learning-tickets/common';
import { createOrder } from '../actions/orders/create-order';

export const createOrderRouter = express.Router();

createOrderRouter.post(
  '/',
  requireAuth,
  [body('ticketId').trim().notEmpty().withMessage('A ticket id is required.')],
  validateRequest,
  async (req: Request, res: Response) => {

    const { ticketId } = req.body;

    const order = await createOrder({ticketId, userId: req.currentUser!.id})

    res.status(201).send(order);
  }
);
