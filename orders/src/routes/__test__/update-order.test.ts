import request from 'supertest';

import { app } from '../../app';

import mongoose from 'mongoose';

import { natsClient } from '../../nats-client';

import { Order, Ticket } from '../../models';
import { OrderStatus } from '@microservices-learning-tickets/common';

const id = new mongoose.Types.ObjectId().toHexString();

describe('update ticket', () => {
  it('takes a patch request', async () => {
    const response = await request(app).patch(`/api/orders/${id}`).send({});

    expect(response.status).not.toEqual(404);
  });

  it('returns a 404 if the id does not exist', async () => {
    const cookie = await signin();
    await request(app)
      .patch(`/api/orders/${id}`)
      .set('Cookie', cookie)
      .send({
        status: OrderStatus.AwaitingPayment,
      })
      .expect(404);
  });

  it('returns a 401 if the order userId does not match the user who sent the request', async () => {
    const ticket1 = Ticket.build({
      title: 'new ticket',
      price: 10,
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

    const cookie = await signin();

    await request(app)
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send({
        status: OrderStatus.AwaitingPayment,
      })
      .expect(401);
  });

  it('can only be accessed if user is signed in.', async () => {
    await request(app).patch(`/api/orders/${id}`).send({}).expect(401);
  });

  it('returns a valid status if the user is signed in', async () => {
    const cookie = await signin();
    const response = await request(app)
      .patch(`/api/orders/${id}`)
      .set('Cookie', cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('validates the status', async () => {
    const cookie = await signin();
    await request(app)
      .patch(`/api/orders/${id}`)
      .set('Cookie', cookie)
      .send({
        status: 'Test',
      })
      .expect(400);
  });

  it('updates an order', async () => {
    const cookie = await signin();

    const ticket1 = Ticket.build({
      title: 'new ticket',
      price: 10,
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

    const ticketResponse = await request(app)
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send({
        status: OrderStatus.AwaitingPayment,
      });

    expect(ticketResponse.status).toEqual(200);
    expect(ticketResponse.body).toMatchObject({
      status: OrderStatus.AwaitingPayment,
    });
  });

  //   it('publishes an event', async () => {
  //     const cookie = await signin();

  //     const title1 = 'Test1';
  //     const title2 = 'Test2';

  //     const price = 10;

  //     const ticketResponse = await request(app)
  //       .post(`/api/tickets/`)
  //       .set('Cookie', cookie)
  //       .send({
  //         title: title1,
  //         price,
  //       });

  //     const responseUpdate = await request(app)
  //       .patch(`/api/tickets/${ticketResponse.body.id}`)
  //       .set('Cookie', cookie)
  //       .send({
  //         title: title2,
  //         price: 20,
  //       });
  //     expect(natsClient.client.publish).toBeCalled();
  //   });
});
