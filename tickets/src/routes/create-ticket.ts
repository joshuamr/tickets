import express, {Request, Response} from 'express';
import { body } from 'express-validator'

import { Ticket } from '../models/ticket'

import { requireAuth, validateRequest, BadRequestError } from '@microservices-learning-tickets/common'

export const createTicketRouter = express.Router();

createTicketRouter.post('/', requireAuth, [
		body('title').trim().notEmpty().withMessage('A title is required.'),
		body('price').isFloat({gt: 0}).withMessage('A valid price is required.'),
	], validateRequest, async (req: Request, res: Response) => {
	const { title, price } = req.body

	// using force because we know the middleware validated the current user
	const ticket = Ticket.build({title, price, userId: req.currentUser!.id})
	
	await ticket.save()
	
	res.status(201).send(ticket)
})

