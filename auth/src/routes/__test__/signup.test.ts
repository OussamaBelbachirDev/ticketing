import request from 'supertest';
import app from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(201);
});

it('Returns a 400 Invalid Email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'oussvever', password: 'oussama' })
    .expect(400);
});

it('Returns a 400 Invalid Password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss@gmail.com', password: 'dd' })
    .expect(400);
});

it('Returns a 400 Invalid Email And Password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss', password: 'dd' })
    .expect(400);
});

it('Disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'ouss@gmail.com', password: 'oussama' })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
