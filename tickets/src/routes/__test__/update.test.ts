import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/Ticket';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'cfiurefhueir', price: 55 })
    .expect(201);
};

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put('/api/tickets/' + id)
    .send()
    .expect(401);
});

it('returns a 404 if the provided id does not exsist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put('/api/tickets/' + id)
    .set('Cookie', global.signin())
    .send({ title: 'vgrbhvyr', price: 20 })
    .expect(404);
});

it('returns a 401 if the user does not own ticket', async () => {
  const response = await createTicket();

  await request(app)
    .put('/api/tickets/' + response.body.id)
    .set('Cookie', global.signin())
    .send({ title: 'vgrbhvyr', price: 20 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const ticketResp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'cfiurefhueir', price: 55 })
    .expect(201);

  await request(app)
    .put('/api/tickets/' + ticketResp.body.id)
    .set('Cookie', cookie)
    .send({ title: '', price: -20 })
    .expect(400);
});
it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const ticketResp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'cfiurefhueir', price: 55 })
    .expect(201);

  await request(app)
    .put('/api/tickets/' + ticketResp.body.id)
    .set('Cookie', cookie)
    .send({ title: 'my title', price: 300 })
    .expect(200);

  const ticketResponse = await request(app).get(
    '/api/tickets/' + ticketResp.body.id
  );

  expect(ticketResponse.body.title).toEqual('my title');
  expect(ticketResponse.body.price).toEqual(300);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const ticketResp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'cfiurefhueir', price: 55 })
    .expect(201);

  await request(app)
    .put('/api/tickets/' + ticketResp.body.id)
    .set('Cookie', cookie)
    .send({ title: 'my title', price: 300 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved !', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'Concert RMA',
    price: 555,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  ticket.orderId = new mongoose.Types.ObjectId().toHexString();
  await ticket.save();

  await request(app)
    .put('/api/tickets/' + ticket.id)
    .set('Cookie', cookie)
    .send()
    .expect(400);

  console.log(ticket);
});
