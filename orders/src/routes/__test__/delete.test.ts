import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/Ticket';
import { OrderStatus } from '@ousstickets/common';
import { Order } from '../../models/Order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  const cookie = global.signin();

  // Create a ticket
  const ticket = Ticket.build({
    price: 555,
    title: 'golf vip kech',
    id: '65ca164e0d47bb3b3cebb39a',
  });
  await ticket.save();

  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Make a request to cancel the order

  await request(app)
    .delete('/api/orders/' + order.id)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  // Expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

// it.todo('emits an order cancelled event');

it('emits an order cancelled event', async () => {
  const cookie = global.signin();

  // Create a ticket
  const ticket = Ticket.build({
    price: 555,
    title: 'golf vip kech',
    id: '65ca164e0d47bb3b3cebb39a',
  });
  await ticket.save();

  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  //
  await request(app)
    .delete('/api/orders/' + order.id)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
