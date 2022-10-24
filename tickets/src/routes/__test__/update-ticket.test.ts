import request from 'supertest'

import { app } from '../../app'

import mongoose from 'mongoose'
import {Ticket} from '../../models/ticket'

const id = new mongoose.Types.ObjectId().toHexString()

describe('update ticket', () => {

	it ('takes a patch request', async ()=> {
		const response = await request(app).patch(`/api/tickets/${id}`).send({})

		expect(response.status).not.toEqual(404)
	})

	it ('returns a 404 if the id does not exist', async ()=> {
		const cookie = await signin()
		await request(app).patch(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({
			title: 'TEST2',
			price: 20
		})
		.expect(404)
	})

	it ('returns a 401 if the ticket userId does not match the user who sent the request', async ()=> {
		const ticket = Ticket.build({userId: 'test', title: 'hello', price: 10})
		await ticket.save()

		const cookie = await signin()
		
		await request(app).patch(`/api/tickets/${ticket.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'TEST2',
			price: 20
		})
		.expect(401)

		const originalTicket = await request(app).get(`/api/tickets/${ticket.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'TEST2',
			price: 20
		})

		expect(originalTicket.body.title).toEqual('hello')
		expect(originalTicket.body.price).toEqual(10)
	})


	it ('can only be accessed if user is signed in.', async ()=> {
		await request(app).patch(`/api/tickets/${id}`)
		.send({})
		.expect(401)
	})

	it('returns a valid status if the user is signed in', async () => {
	const cookie = await signin()
	const response = await request(app).patch(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({})

	expect(response.status).not.toEqual(401)
	})

	it ('validates title', async ()=> {
		const cookie = await signin()
		await request(app).patch(`/api/tickets/${id}`)
			.set('Cookie', cookie)
			.send({
				price: '1.00'
			})
			.expect(400)

		await request(app).patch(`/api/tickets/${id}`)
			.set('Cookie', cookie)
			.send({
				price: '1.00',
				title: ''
			})
			.expect(400)


	})

	it ('validates price', async ()=> {
		const cookie = await signin()
		await request(app).patch(`/api/tickets/${id}`)
			.set('Cookie', cookie)
			.send({
				title: 'Test',
			}).expect(400)

		await request(app).patch(`/api/tickets/${id}`)
			.set('Cookie', cookie)
			.send({
				title: 'Test',
				price: -10
			}).expect(400)

	})

	it ('updates a ticket', async ()=> {
		const cookie = await signin()

		const title1 =  'Test1'
		const title2 =  'Test2'

		const price = 10

		const ticketResponse = await request(app).post(`/api/tickets/`)
			.set('Cookie', cookie)
			.send({
				title: title1,
				price
			})

		const responseUpdate = await request(app).patch(`/api/tickets/${ticketResponse.body.id}`)
			.set('Cookie', cookie)
			.send({
				title: title2, price: 20
			})

		expect(responseUpdate.status).toEqual(200)
		expect(responseUpdate.body).toMatchObject({title:title2, price: 20})

	})

})