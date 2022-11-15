import request from 'supertest';

import { app } from '../../app';

import { Ticket, Order } from '../../models';
import { OrderStatus } from '@microservices-learning-tickets/common';

it('returns all the orders for a user', async () => {
  const ticket1 = Ticket.build({
    title: 'new ticket',
    price: 10,
  });

  await ticket1.save();

  const order = Order.build({
    ticket: ticket1,
    userId: 'some other userId',
    status: OrderStatus.Created,
    expiresAt: new Date(
      new Date().setSeconds(new Date().getSeconds() + 60 * 3)
    ),
  });

  await order.save();

  const cookie = await signin();

  const ticket2 = Ticket.build({
    title: 'new ticket',
    price: 10,
  });

  await ticket2.save();

  const { body: order1Created } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket2.id,
    });

  const ticket3 = Ticket.build({
    title: 'new ticket',
    price: 10,
  });

  await ticket3.save();

  const { body: order2Created } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket3.id,
    });

  const response = await request(app).get('/api/orders').set('Cookie', cookie);

  expect(response.body).toMatchObject([order1Created, order2Created]);
  expect(response.body.length).toEqual(2);
});
