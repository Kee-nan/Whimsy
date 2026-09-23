const request = require('supertest');
const app = require('../app');
const { createAndLoginUser } = require('./helpers');

describe('Friendships', () => {
  it('sends, then accepts, a friend request', async () => {
    const { token: tokenA } = await createAndLoginUser();
    const { token: tokenB, user: userB } = await createAndLoginUser();
    await request(app).post('/api/friends/send').set('Authorization', `Bearer ${tokenA}`).send({ receiverUsername: userB.username }).expect(200);

    const pendingRes = await request(app).get('/api/friends/pending').set('Authorization', `Bearer ${tokenB}`);
    expect(pendingRes.body).toHaveLength(1);

    await request(app).post('/api/friends/acceptRequest').set('Authorization', `Bearer ${tokenB}`).send({ requestId: pendingRes.body[0].id }).expect(200);

    const friendsRes = await request(app).get('/api/friends/friends').set('Authorization', `Bearer ${tokenA}`);
    expect(friendsRes.body).toHaveLength(1);
  });

  it('rejects sending a friend request to yourself', async () => {
    const { token, user } = await createAndLoginUser();
    const res = await request(app).post('/api/friends/send').set('Authorization', `Bearer ${token}`).send({ receiverUsername: user.username });
    expect(res.status).toBe(400);
  });

  it('blocks a non-friend from viewing friend-lists', async () => {
    const { token: tokenA } = await createAndLoginUser();
    const { user: userB } = await createAndLoginUser();
    const res = await request(app).get(`/api/friends/friend-lists/${userB.id || 999999}`).set('Authorization', `Bearer ${tokenA}`);
    expect([403, 404]).toContain(res.status);
  });
});