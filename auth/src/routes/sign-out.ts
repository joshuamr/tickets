import express from 'express'

export const signOutRouter = express.Router()

signOutRouter.post('/', (req, res, next) => {
	req.session = null
	res.send({})
})