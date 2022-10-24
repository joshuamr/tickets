import express, {Request, Response} from 'express';

import { Ticket } from '../models/ticket'

import { requireAuth, NotFoundError } from '@microservices-learning-tickets/common'

export const getTicketsRouter = express.Router();

getTicketsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
	// using force because we know the middleware validated the current user
	const tickets = await Ticket.find({})
	res.status(200).send(tickets)
})

