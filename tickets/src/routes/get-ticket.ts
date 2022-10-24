import express, {Request, Response} from 'express';

import { Ticket } from '../models/ticket'

import { requireAuth, NotFoundError } from '@microservices-learning-tickets/common'

export const getTicketRouter = express.Router();

getTicketRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
	const {id} = req.params

	// using force because we know the middleware validated the current user
	const ticket = await Ticket.findById(id)


	if (!ticket) {
		throw new NotFoundError()
	}
	
	res.status(200).send(ticket)
})

