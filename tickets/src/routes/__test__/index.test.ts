import request from 'supertest';
import app from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'cfiurefhueir', price: 55 })
    .expect(201);
};

it('get all tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets').send().expect(200);
  // console.log(res.body);

  expect(res.body.length).toEqual(3);
});
