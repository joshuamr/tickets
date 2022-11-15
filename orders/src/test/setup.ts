import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'

import jwt from 'jsonwebtoken'


declare global {
	var signin: () =>Promise<string>
}

jest.mock('../nats-client')
let mongo: MongoMemoryServer

beforeAll(async () => {
	process.env.JWT_KEY = 'somethingsecret'

	mongo = await MongoMemoryServer.create();
  	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
	// resets the jest.fn()
	jest.clearAllMocks()
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

	const token = jwt.sign({
		id: 'random',
		email: 'test@test.com'
	}, process.env.JWT_KEY || '')

	// create the session
	const session = {jwt: token}

	// convert to json
	const sessionJSON = JSON.stringify(session)

	// encode as base64
	const base64 = Buffer.from(sessionJSON).toString('base64')

	return `session=${base64}`
}