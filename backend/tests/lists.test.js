const request = require('supertest');
const app = require('../app');
const { createAndLoginUser } = require('./helpers');

describe('List entries', () => {
  it('adds a media item to a list and retrieves it', async () => {
    const { token } = await createAndLoginUser();

    const media = { id: 'movie/12345', media: 'movie', title: 'Test Movie', image: 'http://example.com/img.jpg', listType: 'current' };
    await request(app)
      .post('/api/list/upsert')
      .set('Authorization', `Bearer ${token}`)
      .send({ media })
      .expect(200);

    const res = await request(app).get('/api/list/lists').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.current).toHaveLength(1);
    expect(res.body.current[0].id).toBe('movie/12345');
    expect(res.body.current[0].title).toBe('Test Movie');
  });

  it('does not create duplicate media_items rows for the same composite id added twice', async () => {
    const { token } = await createAndLoginUser();
    const media = { id: 'movie/99999', media: 'movie', title: 'Dup Test', image: '', listType: 'current' };

    await request(app).post('/api/list/upsert').set('Authorization', `Bearer ${token}`).send({ media }).expect(200);
    // Move it to a different status — should update, not duplicate.
    await request(app).post('/api/list/upsert').set('Authorization', `Bearer ${token}`).send({ media: { ...media, listType: 'completed' } }).expect(200);

    const res = await request(app).get('/api/list/lists').set('Authorization', `Bearer ${token}`);
    expect(res.body.current).toHaveLength(0);
    expect(res.body.completed).toHaveLength(1);
  });

  it('removes a media item from a list', async () => {
    const { token } = await createAndLoginUser();
    const media = { id: 'movie/55555', media: 'movie', title: 'Remove Me', image: '', listType: 'current' };
    await request(app).post('/api/list/upsert').set('Authorization', `Bearer ${token}`).send({ media }).expect(200);

    await request(app)
      .delete('/api/list/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ mediaId: 'movie/55555' })
      .expect(200);

    const res = await request(app).get('/api/list/lists').set('Authorization', `Bearer ${token}`);
    expect(res.body.current).toHaveLength(0);
  });
});