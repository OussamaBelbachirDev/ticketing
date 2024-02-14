import mongoose from 'mongoose';
import app from '../../app';
import request from 'supertest';
import { Order } from '../../models/Order';
import { OrderStatus } from '@ousstickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/Payment';
jest.mock('../../stripe');

it('returns 404 when order does not exist', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'fkjireojeojgeiorjge',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns 401 when order does not belong to the user', async () => {
  const cookie = global.signin();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 900,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'fkjireojeojgeiorjge',
      orderId: order.id,
    })
    .expect(401);
});

it('returns 400 when order is cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 900,
    version: 0,
    userId: userId,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'fkjireojeojgeiorjge',
      orderId: order.id,
    })
    .expect(400);
});

it('returns 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 900,
    version: 0,
    userId: userId,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalled();

  const stripeCharge = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  console.log(stripeCharge);

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge.currency).toEqual('usd');

  const payment = await Payment.find({
    orderId: order.id,
    stripeId: 'abcd', // defined in __mock__
  });

  expect(payment).not.toBeNull();
});
