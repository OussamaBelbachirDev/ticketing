import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@ousstickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/Ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new NotFoundError();
    ticket.set({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
