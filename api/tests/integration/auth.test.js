import request from 'supertest';
import { app, startServer, closeServer } from '../../server.js';
import { Usuario } from '../../models/index.js';
import bcrypt from 'bcryptjs';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await startServer();
    // A senha é "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    await Usuario.create({
      matricula: 'login123',
      senha: hashedPassword,
      tipo: 'user',
    });
  });

  afterAll(async () => {
    await closeServer();
  });

  // Teste de login com sucesso
  it('should login successfully with valid credentials and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        matricula: 'login123',
        senha: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.matricula).toBe('login123');
  });

  // Teste de falha de login com senha incorreta
  it('should fail to login with invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        matricula: 'login123',
        senha: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Credenciais inválidas');
  });

  // Teste de falha de login com matrícula inexistente
  it('should fail to login with non-existent matricula', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        matricula: 'nonexistentuser',
        senha: 'password123',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Credenciais inválidas');
  });

  // Teste de validação para campos ausentes
  it('should return 400 if matricula is missing', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        senha: 'password123',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 if senha is missing', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        matricula: 'login123',
      });
    expect(res.statusCode).toEqual(400);
  });
});
