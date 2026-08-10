const request = require('supertest');
const app = require('../app');

async function createAndLoginUser(overrides = {}) {
  const user = {
    firstName: 'Test', lastName: 'User',
    username: `testuser_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    email: `test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    password: 'password123',
    ...overrides,
  };
  await request(app).post('/api/accounts/create').send(user).expect(201);
  const loginRes = await request(app)
    .post('/api/accounts/login')
    .send({ username: user.username, password: user.password })
    .expect(200);
  return { user, token: loginRes.body.user_token };
}

module.exports = { createAndLoginUser };