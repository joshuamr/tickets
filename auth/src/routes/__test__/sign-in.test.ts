import request from 'supertest'

import { app } from '../../app'

it('fails when an email that does not exist is supplied', async () => {
	return request(app)
		.post('/api/users/sign-in')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(401)
})

it('fails when an incorrect password is supplied', async () => {
	await request(app)
		.post('/api/users/sign-up')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201)

	return request(app)
		.post('/api/users/sign-in')
		.send({
			email: 'test@test.com',
			password: 'wrong'
		})
		.expect(401)
})

it('responds with a cookie when given valid credentials', async () => {
	await request(app)
		.post('/api/users/sign-up')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(201)

	const response = await request(app)
		.post('/api/users/sign-in')
		.send({
			email: 'test@test.com',
			password: 'password'
		})
		.expect(200)

	expect(response.get('Set-Cookie')).toBeDefined()
})