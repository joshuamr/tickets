import request from 'supertest'

import { app } from '../../app'

import { Ticket } from '../../models/ticket'
import { natsClient} from '../../nats-client'

it ('takes a post request', async ()=> {
	const response = await request(app).post('/api/tickets').send({})

	expect(response.status).not.toEqual(404)
})

it ('can only be accessed if user is signed in.', async ()=> {
	await request(app).post('/api/tickets')
	.send({})
	.expect(401)
})

it('returns a valid status if the user is signed in', async () => {
const cookie = await signin()
const response = await request(app).post('/api/tickets')
	.set('Cookie', cookie)
	.send({})

expect(response.status).not.toEqual(401)
})

it ('validates title', async ()=> {
	const cookie = await signin()
	await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			price: '1.00'
		})
		.expect(400)

	await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			price: '1.00',
			title: ''
		})
		.expect(400)


})

it ('validates price', async ()=> {
	const cookie = await signin()
	await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'Test',
		}).expect(400)

	await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'Test',
			price: -10
		}).expect(400)

})

it ('creates a ticket', async ()=> {
	const cookie = await signin()

	let tickets = await Ticket.find({})
	expect(tickets.length).toEqual(0)

	const title =  'Test'

	const price = 10

	const response = await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price
		})

	expect(response.status).toEqual(201)

	tickets = await Ticket.find({})
	expect(tickets.length).toEqual(1)
	expect(tickets[0]).toMatchObject({title, price})

})

it('publishes an event', async () => {
	const cookie = await signin()
	const title =  'Test'

	const price = 10

	const response = await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price
		})
	expect(natsClient.client.publish).toBeCalled()
})