const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

describe('bookmarks', () => {
  it('get all', async (done) => {
    const res = await request.get('/api/v1/bookmarks');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([]);
    await request.post('/api/v1/bookmarks').send({
      url: 'http://google.com/',
      title: 'Google',
    });
    const res1 = await request.get('/api/v1/bookmarks');
    expect(res1.body.length).toEqual(1);
    done();
  });

  it('creates and gets bookmark', async (done) => {
    const url = 'http://google.com/';
    const res = await request.post('/api/v1/bookmarks').send({
      url,
      title: 'Google',
    });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const res1 = await request.get(`/api/v1/bookmarks/${res.body.id}`);
    expect(res1.status).toEqual(200);
    expect(res1.body.url).toEqual(url);
    done();
  });

  it('deletes bookmark', async (done) => {
    const url = 'http://google.com/';
    const res = await request.post('/api/v1/bookmarks').send({
      url,
      title: 'Google',
    });
    const res1 = await request.delete(`/api/v1/bookmarks/${res.body.id}`);
    expect(res1.status).toEqual(204);
    const res2 = await request.delete(`/api/v1/bookmarks/${res.body.id}`);
    expect(res2.status).toEqual(404);
    done();
  });
});
