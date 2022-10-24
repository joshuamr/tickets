import request from 'supertest'

import { app } from '../../app'

import mongoose from 'mongoose'

describe('get ticket', () => {

	it('returns a 404 if the ticket is not found', async() => {
		const cookie = await signin()
		const id = new mongoose.Types.ObjectId().toHexString()
		const response = await request(app).get(`/api/tickets/${id}`).set('Cookie', cookie).send({})

		expect(response.status).toEqual(404)
	})

	it ('takes a get request', async ()=> {
		const response = await request(app).get('/api/tickets/1').send({})

		expect(response.status).not.toEqual(404)
	})

	it ('can only be accessed if user is signed in.', async ()=> {
		await request(app).get('/api/tickets/1')
		.send({})
		.expect(401)
	})

	it('returns a valid status if the user is signed in', async () => {
	const cookie = await signin()
	const id = new mongoose.Types.ObjectId().toHexString()
	const response = await request(app).get(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({})

	expect(response.status).not.toEqual(401)
	})

	it ('returns the correct ticket', async ()=> {
		const cookie = await signin()

		const title =  'Test'

		const price = 10

		const ticket = await request(app).post('/api/tickets')
			.set('Cookie', cookie)
			.send({
				title,
				price
			})

		const response = await request(app).get(`/api/tickets/${ticket.body.id}`)
			.set('Cookie', cookie)
			.send({
				title,
				price
			})

		expect(response.status).toEqual(200)

	})

})