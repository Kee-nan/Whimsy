const request = require('supertest');
const app = require('../app');
const { createAndLoginUser } = require('./helpers');

describe('Reviews and media stats', () => {
  it('adds a review and retrieves it', async () => {
    const { token } = await createAndLoginUser();
    const reviewData = { id: 'movie/7777', image: '', rating: 25, review: 'Great movie', title: 'Test' };

    await request(app).post('/api/review/add').set('Authorization', `Bearer ${token}`).send({ reviewData }).expect(200);

    const res = await request(app)
      .get('/api/review/get')
      .query({ mediaType: 'movie', id: '7777' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.review.rating).toBe(25);
  });

  it('computes a correct global average across multiple users', async () => {
    const { token: tokenA } = await createAndLoginUser();
    const { token: tokenB } = await createAndLoginUser();
    const media = { id: 'movie/8888', image: '', title: 'Shared Movie' };

    await request(app).post('/api/review/add').set('Authorization', `Bearer ${tokenA}`).send({ reviewData: { ...media, rating: 20, review: 'Good' } }).expect(200);
    await request(app).post('/api/review/add').set('Authorization', `Bearer ${tokenB}`).send({ reviewData: { ...media, rating: 10, review: 'Meh' } }).expect(200);

    const res = await request(app)
      .get('/api/review/stats')
      .query({ mediaType: 'movie', id: '8888' })
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.body.global.average).toBe(15);
    expect(res.body.global.count).toBe(2);
  });
});