import express from 'express'

import { currentUser } from '@microservices-learning-tickets/common'

export const currentUserRouter = express.Router()

currentUserRouter.get('/', currentUser, (req, res, next) => {
	res.status(200).send({currentUser: req.currentUser || null})
})