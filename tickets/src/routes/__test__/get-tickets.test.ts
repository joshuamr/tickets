import request from 'supertest'

import { app } from '../../app'

it ('returns all the tickets', async ()=> {
	const cookie = await signin()

	const title1 =  'Test1'
	const title2 =  'Test2'

	const price = 10

	await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: title1,
			price
		})

	await request(app).post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: title2,
			price
		})

	const response = await request(app).get('/api/tickets')
		.set('Cookie', cookie)
		.send({
		})

	expect(response.status).toEqual(200)
	expect(response.body.length).toEqual(2)
	expect(response.body).toMatchObject([{title: title1, price}, {title: title2, price}])

})