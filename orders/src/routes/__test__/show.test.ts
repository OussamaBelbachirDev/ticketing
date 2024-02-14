import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/Ticket';

it('fetches the order', async () => {
  const cookie = global.signin();
  // Create a ticket
  const ticket = Ticket.build({
    title: 'my tickeeeet',
    price: 12200,
    id: '65ca164e0d47bb3b3cebb39a',
  });
  await ticket.save();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another user order', async () => {
  const cookie = global.signin();
  const secondCookie = global.signin();
  // Create a ticket
  const ticket = Ticket.build({
    title: 'my tickeeeet',
    price: 12200,
    id: '65ca164e0d47bb3b3cebb39a',
  });
  await ticket.save();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Make request to fetch the order

  await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', secondCookie)
    .send()
    .expect(401);
});
