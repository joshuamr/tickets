import jwt from 'jsonwebtoken';

declare global {
  var signin: () => Promise<string>;
}

jest.mock('../event-bus/nats-client');

beforeAll(async () => {
  process.env.JWT_KEY = 'somethingsecret';
});

beforeEach(async () => {
  // resets the jest.fn()
  jest.clearAllMocks();
});

global.signin = async () => {
  const token = jwt.sign(
    {
      id: 'random',
      email: 'test@test.com',
    },
    process.env.JWT_KEY || ''
  );

  // create the session
  const session = { jwt: token };

  // convert to json
  const sessionJSON = JSON.stringify(session);

  // encode as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return `session=${base64}`;
};
