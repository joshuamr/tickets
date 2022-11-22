import express, {Request, Response} from 'express';

import { requireAuth } from '@microservices-learning-tickets/common'
import { getTicket } from '../db/db-actions/get-ticket-from-db';

export const getTicketRouter = express.Router();

getTicketRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
	const {id} = req.params

	// using force because we know the middleware validated the current user
	const ticket = await getTicket(id)
	
	res.status(200).send(ticket)
})

