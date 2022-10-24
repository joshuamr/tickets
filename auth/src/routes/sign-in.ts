import express, {Request, Response, NextFunction} from 'express'

import { body } from 'express-validator'
import { validateRequest, BadRequestError } from '@microservices-learning-tickets/common'
import { User } from '../models/user'
import { Password} from '../services/password'
import jwt from 'jsonwebtoken'

export const signInRouter = express.Router()

signInRouter.post('/', [
	body('email').isEmail().withMessage('Email must be a valid email.'),
	body('password').trim().notEmpty().withMessage('You must supply a password.'), 
	
], validateRequest, async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body
	const existingUser = await User.findOne({email })

	if (!existingUser) {
		throw new BadRequestError('Invalid credentials.')
	}

	const passwordsMatch = await Password.compare(existingUser.password, password)

	if (passwordsMatch) {
		// generate jwt
		// ran kubectl create secret generic jwt-secret --from-literal=JWT_KEY=somesupersecretsecret
		// use config files for this in the future
		const userJwt = jwt.sign({
			id: existingUser.id,
			email: existingUser.email
		}, process.env.JWT_KEY || '',)

		// store it on session
		req.session = {jwt: userJwt}
		res.status(200).send(existingUser)
	} else {
		throw new BadRequestError('Invalid credentials.') 
	}
})