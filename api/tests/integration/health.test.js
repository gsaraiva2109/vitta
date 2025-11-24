import request from 'supertest';
import app from '../../server.js';

describe('Health Check', () => {
  it('should return 200 OK for Swagger documentation', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    // Should be HTML since it serves Swagger UI
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('erro', 'Rota não encontrada');
  });
});
