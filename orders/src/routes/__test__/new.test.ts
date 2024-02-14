import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { Ticket } from '../../models/Ticket';
import { OrderStatus } from '@ousstickets/common';
import { Order } from '../../models/Order';
import { natsWrapper } from '../../nats-wrapper';
it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const cookie = global.signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'my tickeeeet',
    price: 777,
    id: '65ca164e0d47bb3b3cebb39a',
  });
  await ticket.save();

  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
    userId: 'vnuireghierugh',
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('Reserves a ticket', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'my tickeeeet',
    price: 777,
    id: '65ca164e0d47bb3b3cebb39a',
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

// it.todo('emit an order created event');

it('emit an order created event', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'my tickeeeet',
    price: 777,
    id: '65ca164e0d47bb3b3cebb39a',
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
