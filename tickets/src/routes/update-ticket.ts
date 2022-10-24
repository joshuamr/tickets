import express, {Request, Response} from 'express';
import { body } from 'express-validator'

import { Ticket } from '../models/ticket'

import { requireAuth, validateRequest, NotFoundError, UnauthorizedError } from '@microservices-learning-tickets/common'

export const updateTicketRouter = express.Router();

updateTicketRouter.patch('/:id', requireAuth, [
		body('title').trim().notEmpty().withMessage('A title is required.'),
		body('price').isFloat({gt: 0}).withMessage('A valid price is required.'),
	], validateRequest, async (req: Request, res: Response) => {
	const { title, price } = req.body
	const {id} = req.params

	// using force because we know the middleware validated the current user
	const ticket = await Ticket.findById(id)

	if (!ticket) {
		throw new NotFoundError()
	}

	if (ticket.userId !== req.currentUser?.id) {
		throw new UnauthorizedError()

	}

	ticket.set({title, price})
	await ticket.save()
	
	res.status(200).send(ticket)
})

