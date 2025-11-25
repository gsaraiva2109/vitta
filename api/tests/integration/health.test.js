import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, startServer, closeServer } from '../../server.js';
import sequelize from '../../config/database';

describe('Health Check', () => {
  beforeAll(async () => {
    await startServer();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await closeServer();
  });

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
