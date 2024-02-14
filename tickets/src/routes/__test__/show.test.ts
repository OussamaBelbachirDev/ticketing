import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/Ticket';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get('/api/tickets/' + id)
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'my title';
  const price = 55;

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title, price })
    .expect(201);

  console.log('===> ', ticket.body);
  const tickets = await Ticket.find({});
  console.log(tickets);

  expect(tickets[0].title).toEqual(title);

  await request(app)
    .get('/api/tickets/' + ticket.body.id)
    .expect(200);
});
