const request = require('supertest');
const app = require('../app');
const { createAndLoginUser } = require('./helpers');

describe('Custom lists (tags)', () => {
  it('creates a list, adds an item, and retrieves it', async () => {
    const { token } = await createAndLoginUser();
    const createRes = await request(app)
      .post('/api/custom-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Horror', description: 'Scary stuff', isRanked: false, visibility: 'public' })
      .expect(201);

    const listId = createRes.body.id;
    await request(app)
      .post(`/api/custom-lists/${listId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ media: { id: 'movie/1111', media: 'movie', title: 'Hereditary', image: '' } })
      .expect(200);

    const detailRes = await request(app).get(`/api/custom-lists/${listId}`).set('Authorization', `Bearer ${token}`);
    expect(detailRes.body.items).toHaveLength(1);
  });

  it('prevents a non-owner from deleting someone else\'s list', async () => {
    const { token: owner } = await createAndLoginUser();
    const { token: intruder } = await createAndLoginUser();
    const createRes = await request(app).post('/api/custom-lists').set('Authorization', `Bearer ${owner}`).send({ name: 'Private List', visibility: 'private' }).expect(201);

    const res = await request(app).delete(`/api/custom-lists/${createRes.body.id}`).set('Authorization', `Bearer ${intruder}`);
    expect(res.status).toBe(403);
  });
});