import {
  requireAuth,
  UnauthorizedError,
  validateRequest,
} from '@microservices-learning-tickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { getOrder } from '../actions/orders/get-order';
import { createPayment } from '../actions/payments/create-payment';

export const createPaymentRouter = express.Router();

createPaymentRouter.post(
  '/',
  requireAuth,
  [
    body('token')
      .notEmpty()
      .withMessage('A token is required to create a charge.'),
    body('orderId')
      .notEmpty()
      .withMessage('An orderId is required to create a charge.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await getOrder(orderId);

    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    const payment = await createPayment(orderId, token);

    res.status(201).send(payment);
  }
);
