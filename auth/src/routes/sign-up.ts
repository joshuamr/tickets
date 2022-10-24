import express, {Request, Response, NextFunction} from 'express'
import { body } from 'express-validator'
import { User } from '../models/user'
import { BadRequestError, validateRequest } from '@microservices-learning-tickets/common'

import jwt from 'jsonwebtoken'

export const signUpRouter = express.Router()

signUpRouter.post('/', [
		body('email').isEmail().withMessage('Please provide a valid email.'),
		body('password').trim().isLength({min:4, max:20}).withMessage('Password must be between 4 and 20 characters.'),
	], 
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body
		
		const existingUser = await User.findOne({email})

		if (existingUser) {
			throw new BadRequestError('Email already in use.')
		}

		const user = User.build({email, password})

		await user.save()

		// generate jwt
		// ran kubectl create secret generic jwt-secret --from-literal=JWT_KEY=somesupersecretsecret
		// use config files for this in the future
		const userJwt = jwt.sign({
			id: user.id,
			email: user.email
		}, process.env.JWT_KEY || '',)

		// store it on session
		req.session = {jwt: userJwt}
		res.status(201).send(user)

	
})