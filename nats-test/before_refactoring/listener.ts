import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';

console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS 👽 👽 👽 👽 👽 ');

  stan.on('close', () => {
    console.log('nats Connexion Closed! ❌ ❌ ❌');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');

  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log('MSG RECEIVED =====> ' + msg.getSequence());
      console.log(JSON.parse(msg.getData().toString()));
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
