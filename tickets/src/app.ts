import express from 'express'
import 'express-async-errors'

import cookieSession from 'cookie-session'

import { json } from 'body-parser'

import {createTicketRouter} from './routes/create-ticket'
import {getTicketRouter} from './routes/get-ticket'
import {getTicketsRouter} from './routes/get-tickets'
import {updateTicketRouter} from './routes/update-ticket'

import { errorHandler, NotFoundError, currentUser } from '@microservices-learning-tickets/common'

const app = express()

// helps nginx know it's secure
app.set('trust proxy', true)

app.use(json())

app.use(cookieSession({ signed:false, secure: process.env.NODE_ENV !== 'test'}))

//  must run after cookie session
app.use(currentUser)

app.use('/api/tickets', getTicketRouter)
app.use('/api/tickets', updateTicketRouter)
app.use('/api/tickets', getTicketsRouter)
app.use('/api/tickets', createTicketRouter)

app.all('*', async (req, res, next) => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }