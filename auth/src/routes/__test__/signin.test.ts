import request from 'supertest';
import app from '../../app';

it('returns a 400 Email that does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(400);
});

it('Incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'ouss@gmail.com', password: 'oussamaaa' })
    .expect(400);
});

it('responds with a cookie when given Valid Credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
