import request from 'supertest';

import { app } from '../../app';

import mongoose from 'mongoose';

import { Ticket, Order } from '../../db/models';
import { OrderStatus } from '@microservices-learning-tickets/common';

describe('get order', () => {
  it('returns a 404 if the order is not found', async () => {
    const cookie = await signin();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .get(`/api/orders/${id}`)
      .set('Cookie', cookie)
      .send({});

    expect(response.status).toEqual(404);
  });

  it('takes a get request', async () => {
    const response = await request(app).get('/api/orders/1').send({});

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if user is signed in.', async () => {
    await request(app).get('/api/orders/1').send({}).expect(401);
  });

  it('returns a valid status if the user is signed in', async () => {
    const cookie = await signin();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .get(`/api/orders/${id}`)
      .set('Cookie', cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns unauthorized if the order is not for the current user', async () => {
    const cookie = await signin();

    const ticket1 = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'new ticket',
      price: 10,
      version: 0
    });

    await ticket1.save();

    const order = Order.build({
      ticket: ticket1,
      userId: 'some other user',
      status: OrderStatus.Created,
      expiresAt: new Date(
        new Date().setSeconds(new Date().getSeconds() + 60 * 3)
      ),
    });

    await order.save();

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send()
      .expect(401);
  });

  it('returns the correct order', async () => {
    const cookie = await signin();

    const ticket1 = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'new ticket',
      price: 10,
      version: 0
    });

    await ticket1.save();

    const order = Order.build({
      ticket: ticket1,
      userId: 'random',
      status: OrderStatus.Created,
      expiresAt: new Date(
        new Date().setSeconds(new Date().getSeconds() + 60 * 3)
      ),
    });

    await order.save();

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(order.id);
  });
});
