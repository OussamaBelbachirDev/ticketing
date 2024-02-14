import request from 'supertest';
import app from '../../app';

it('Reponds with details about the current User', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual('ouss@gmail.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').expect(200);

  expect(response.body.currentUser).toEqual(null);
});
