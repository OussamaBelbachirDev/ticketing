import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/Ticket';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@ousstickets/common';

const setup = async () => {
  // Create an intance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data event
  const ticket = Ticket.build({
    title: 'Concert RMA',
    price: 900,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.id,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('sets the orderId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg, ticket } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // console.log(JSON.parse(natsWrapper.client.publish.mock.calls[0][1]));
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  // console.log(data);
  // console.log(ticketUpdatedData);

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
