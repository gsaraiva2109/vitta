import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, startServer, closeServer } from '../../server.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
let managerToken;
let userId;

describe('Usuario Routes Integration Tests', () => {
  beforeAll(async () => {
    await startServer();

    // Create a manager user to perform authenticated actions
    const managerRes = await request(app)
      .post('/usuarios')
      .send({
        matricula: 'manager-user',
        senha: 'password123',
        tipo: 'manager',
      });
    expect(managerRes.statusCode).toBe(201);
    const manager = managerRes.body;
    managerToken = jwt.sign({ id: manager.idUsuario, tipo: manager.tipo }, JWT_SECRET, { expiresIn: '1h' });

    // Create a standard user for GET, PUT, DELETE tests
    const userRes = await request(app)
      .post('/usuarios')
      .send({
        matricula: 'std-user',
        senha: 'password123',
        tipo: 'user',
      });
    expect(userRes.statusCode).toBe(201);
    userId = userRes.body.idUsuario;
  });

  afterAll(async () => {
    await closeServer();
  });

  // Teste para criar um usuário (rota pública)
  it('should create a new user via public route', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        matricula: 'new-public-user',
        senha: 'password123',
        tipo: 'user',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('idUsuario');
    expect(res.body.matricula).toBe('new-public-user');
  });

  // Teste para buscar todos os usuários (rota pública)
  it('should get all users via public route', async () => {
    const res = await request(app).get('/usuarios');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2); // Manager and standard user
  });

  // Teste para buscar usuário pelo ID (rota protegida)
  it('should get a user by ID', async () => {
    const res = await request(app)
      .get(`/usuarios/${userId}`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('idUsuario', userId);
  });

  // Teste para buscar usuário pela Matrícula (rota protegida)
  it('should get a user by matricula', async () => {
    const res = await request(app)
      .get('/usuarios/matricula/std-user')
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('matricula', 'std-user');
  });
  
  // Teste para atualizar um usuário (rota protegida)
  it('should update a user', async () => {
    const res = await request(app)
      .put(`/usuarios/${userId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        tipo: 'manager',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.tipo).toBe('manager');
  });

  // Teste para deletar um usuário (rota protegida)
  it('should delete a user', async () => {
    const createRes = await request(app)
      .post('/usuarios')
      .send({
        matricula: 'delete-me',
        senha: 'password123',
        tipo: 'user',
      });
    expect(createRes.statusCode).toBe(201);
    const userToDeleteId = createRes.body.idUsuario;

    const res = await request(app)
      .delete(`/usuarios/${userToDeleteId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    
    expect(res.statusCode).toEqual(204);

    // Verify it's actually deleted
    const getRes = await request(app)
      .get(`/usuarios/${userToDeleteId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(getRes.statusCode).toEqual(404);
  });
});
