import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/Ticket';

const buildTicket = async (id: string) => {
  const ticket = Ticket.build({
    title: 'tickkk 1111111',
    price: 1200,
    id,
  });
  await ticket.save();
  return ticket;
};
it('fetches orders for an particular user', async () => {
  const c1 = global.signin();
  const c2 = global.signin();

  // Create 3 tickets
  const t1 = await buildTicket('65ca164e0d47ff3b3cebb39a');
  const t2 = await buildTicket('65ca164e0d47cc3b3cebb39a');
  const t3 = await buildTicket('65ca164e0d47bb3b3cebb39a');

  // Create 1 order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', c1)
    .send({
      ticketId: t1.id,
    })
    .expect(201);

  // Create 2 orders as User #2
  const resTicketOne = await request(app)
    .post('/api/orders')
    .set('Cookie', c2)
    .send({
      ticketId: t2.id,
    })
    .expect(201);
  const resTicketTwo = await request(app)
    .post('/api/orders')
    .set('Cookie', c2)
    .send({
      ticketId: t3.id,
    })
    .expect(201);

  // Make request to get orders for User #2

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', c2)
    .expect(200);

  // Make sure we only got the orders for User #2

  expect(res.body.length).toEqual(2);
  expect(resTicketOne.body.id).toEqual(res.body[0].id);
  expect(resTicketTwo.body.id).toEqual(res.body[1].id);
  expect(resTicketTwo.body.id).toEqual(res.body[1].id);
  expect(t2.id).toEqual(res.body[0].ticket.id);
  expect(t3.id).toEqual(res.body[1].ticket.id);
});
