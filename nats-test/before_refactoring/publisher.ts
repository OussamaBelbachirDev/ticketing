import nats from 'node-nats-streaming';
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS ✅ ✅ ✅ ✅ ✅');

  const data = JSON.stringify({
    id: '45f4re8f4e',
    title: 'my title',
    price: 200,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event Published ✅');
  });
});

// setInterval(() => {
//   stan.publish('ticket:created', data, () => {
//     console.log('Event Published ✅');
//   });
// }, 500);
