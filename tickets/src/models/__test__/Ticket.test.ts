import { Ticket } from '../Ticket';

it('Implements optimistic concurrency control', async () => {
  // Create an instance of a ticket

  const ticket = Ticket.build({
    title: 'Ticket RMAAA',
    price: 5,
    userId: '123',
  });

  // Save the ticket to the db
  await ticket.save();
  console.log(ticket);

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  console.log(
    'INSTANCES INSTANCES INSTANCES INSTANCES INSTANCES INSTANCES INSTANCES'
  );
  console.log(firstInstance);
  console.log(secondInstance);

  // Make two separate changes to the tickets we fetched
  firstInstance?.set({ price: 10 });
  firstInstance?.set({ price: 15 });

  // Save the first fetched ticket
  await firstInstance?.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInstance?.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point !');
});

it('Increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Ticket RMAAA VS FCB',
    price: 5,
    userId: '123',
  });
  await ticket.save();

  ticket.set({ price: 10 });
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
