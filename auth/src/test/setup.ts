import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'

declare global {
	var signin: () =>Promise<string>
}

let mongo: MongoMemoryServer

beforeAll(async () => {
	process.env.JWT_KEY = 'somethingsecret'

	mongo = await MongoMemoryServer.create();
  	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections()

	for (const collection of collections) {
		await collection.deleteMany({})
	}
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
	const email = 'test@test.com'
	const password = 'password'
	const response = await request(app)
		.post('/api/users/sign-up')
		.send({
			email,
			password
		})
		.expect(201)
	
	const cookie = response.get('Set-Cookie')[0]

	return cookie
}