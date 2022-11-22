import { OrderStatus } from '@microservices-learning-tickets/common';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { createCharge } from '../../charge/create-charge';
import { Order } from '../../db/models/order';
import { Payment } from '../../db/models/payment';
import { natsClient } from '../../event-bus/nats-client';

describe('api/payments post', () => {
  it('should require the user to be signed in', async () => {
    await request(app).post('/api/payments').send({}).expect(401);
  });

  it('should validate orderId', async () => {
    const cookie = await signin();
    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({})
      .expect(400);
  });

  it('should validate token', async () => {
    const cookie = await signin();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ orderId: '1' })
      .expect(400);
  });

  it('should throw when the order is not found', async () => {
    const cookie = await signin();
    const orderId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ orderId, token: '1' })
      .expect(404);
  });

  it('should throw when the user is not the user for the order', async () => {
    const cookie = await signin();
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: orderId,
      status: OrderStatus.Created,
      version: 0,
      userId: 'some other user',
      price: 10,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ orderId, token: '1' })
      .expect(401);
  });

  it('should throw when the order is cancelled', async () => {
    const cookie = await signin();
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: orderId,
      status: OrderStatus.Canceled,
      version: 0,
      userId: 'random',
      price: 10,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ orderId, token: '1' })
      .expect(401);
  });

  it('should create a charge', async () => {
    const cookie = await signin();
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: orderId,
      status: OrderStatus.Created,
      version: 0,
      userId: 'random',
      price: 10,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ orderId, token: 'tok_visa' })
      .expect(201);

    expect(createCharge).toBeCalledWith({
      amount: order.price,
      token: 'tok_visa',
    });
  });

  it('should create a payment', async () => {
    const cookie = await signin();
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: orderId,
      status: OrderStatus.Created,
      version: 0,
      userId: 'random',
      price: 10,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ orderId, token: 'tok_visa' })
      .expect(201);

    const payment = Payment.findOne({ orderId });
    expect(payment).toBeTruthy();
  });

  it('should emit an event', async () => {
    const cookie = await signin();
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: orderId,
      status: OrderStatus.Created,
      version: 0,
      userId: 'random',
      price: 10,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ orderId, token: 'tok_visa' })
      .expect(201);

    expect(natsClient.client.publish).toBeCalled();
  });
});
