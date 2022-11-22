import request from 'supertest';

import { app } from '../../app';

import { Order, Ticket } from '../../db/models';
import { natsClient } from '../../event-bus/nats-client';

import mongoose from 'mongoose';
import { OrderStatus } from '@microservices-learning-tickets/common';

it('takes a post request', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in.', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a valid status if the user is signed in', async () => {
  const cookie = await signin();
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('validates ticketId', async () => {
  const cookie = await signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({})
    .expect(400);

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: '',
      title: '',
    })
    .expect(400);
});

it('throws when the ticket is not found', async () => {
  const cookie = await signin();

  let orders = await Order.find({});
  expect(orders.length).toEqual(0);

  const ticketId = new mongoose.Types.ObjectId();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId,
    });

  expect(response.status).toEqual(404);
});

it('throws when the ticket is reserved', async () => {
  const cookie = await signin();

  let orders = await Order.find({});
  expect(orders.length).toEqual(0);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'new ticket',
    price: 10,
    version: 0,
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'random',
    status: OrderStatus.Created,
    expiresAt: new Date(
      new Date().setSeconds(new Date().getSeconds() + 60 * 3)
    ),
  });

  await order.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    });

  expect(response.status).toEqual(401);
});

it('creates an order', async () => {
  const cookie = await signin();

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'new ticket',
    price: 10,
    version: 0
  });

  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    });

  expect(response.status).toEqual(201);

  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].id).toEqual(response.body.id);
});

it('publishes an event', async () => {
	const cookie = await signin();

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'new ticket',
    price: 10,
    version: 0
  });

  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    });

  expect(response.status).toEqual(201);
	expect(natsClient.client.publish).toBeCalled()
})
