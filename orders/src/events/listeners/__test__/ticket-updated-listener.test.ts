import mongoose from 'mongoose';
import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { TicketUpdatedEvent } from '@ousstickets/common';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // Create and save a ticket

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 555,
    title: 'Conceeert',
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: ticket.title,
    price: ticket.price + 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // return all of this stuff
  return {
    msg,
    data,
    listener,
    ticket,
  };
};

it('Finds, updates, saves a ticket', async () => {
  const { msg, data, listener, ticket } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.version).toEqual(data.version);
  expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener } = await setup();
  data.version = 55;
  // Call the onMessage function with the data object + message object

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    return;
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
