const request = require('supertest');
const app = require('../app');
const { createAndLoginUser } = require('./helpers');

describe('Account creation and login', () => {
  it('creates an account and logs in successfully', async () => {
    const { token } = await createAndLoginUser();
    expect(token).toBeDefined();
  });

  it('rejects duplicate usernames', async () => {
    const { user } = await createAndLoginUser();
    const res = await request(app).post('/api/accounts/create').send({ ...user, email: 'different@example.com' });
    expect(res.status).toBe(400);
  });

  it('rejects login with wrong password', async () => {
    const { user } = await createAndLoginUser();
    const res = await request(app).post('/api/accounts/login').send({ username: user.username, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('returns the current user on GET /user with a valid token', async () => {
    const { token, user } = await createAndLoginUser();
    const res = await request(app).get('/api/accounts/user').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(user.username);
  });
});