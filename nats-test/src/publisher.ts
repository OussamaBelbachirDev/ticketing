import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS ✅ ✅ ✅ ✅ ✅');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '45f4re8f4e',
      title: 'my title',
      price: 200,
    });
  } catch (err) {
    console.error(err);
  }
});
