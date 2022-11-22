import express from 'express'
import 'express-async-errors'

import cookieSession from 'cookie-session'

import { json } from 'body-parser'


import { errorHandler, NotFoundError, currentUser } from '@microservices-learning-tickets/common'

const app = express()

// helps nginx know it's secure
app.set('trust proxy', true)

app.use(json())

app.use(cookieSession({ signed:false, secure: process.env.NODE_ENV !== 'test'}))

//  must run after cookie session
app.use(currentUser)



app.all('*', async (req, res, next) => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }