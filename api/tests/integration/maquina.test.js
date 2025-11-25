import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, startServer, closeServer } from '../../server.js';
import { Usuario } from '../../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
let token;
let maquinaId;

describe('Maquina Integration Tests', () => {
  beforeAll(async () => {
    await startServer();

    // Setup a user to authenticate requests
    const user = await Usuario.create({
      matricula: 'maquina-tester',
      senha: 'password123',
      tipo: 'manager',
    });
    token = jwt.sign({ id: user.idUsuario, tipo: user.tipo }, JWT_SECRET, { expiresIn: '1h' });

    // Setup a machine to be used in tests
    const res = await request(app)
      .post('/maquinas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Torno CNC',
        patrimonio: 'PAT-MAQ-001',
        status: 'Ativa',
      });
    expect(res.statusCode).toBe(201);
    maquinaId = res.body.id;
  });

  afterAll(async () => {
    await closeServer();
  });

  // Teste para criar uma máquina
  it('should create a new machine', async () => {
    const res = await request(app)
      .post('/maquinas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Fresadora',
        patrimonio: 'PAT-MAQ-002',
        status: 'Ativa',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Fresadora');
  });

  // Teste para buscar todas as máquinas
  it('should get all machines', async () => {
    const res = await request(app)
      .get('/maquinas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Teste para buscar uma máquina pelo ID
  it('should get a machine by ID', async () => {
    const res = await request(app)
      .get(`/maquinas/${maquinaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', maquinaId);
  });

  // Teste para buscar uma máquina pelo patrimônio
  it('should get a machine by patrimonio', async () => {
    const res = await request(app)
      .get('/maquinas/patrimonio/PAT-MAQ-001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('patrimonio', 'PAT-MAQ-001');
  });

  // Teste para atualizar uma máquina
  it('should update a machine', async () => {
    const res = await request(app)
      .put(`/maquinas/${maquinaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Torno CNC Atualizado',
        status: 'Inativa',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.nome).toBe('Torno CNC Atualizado');
    expect(res.body.status).toBe('Inativa');
  });

  // Teste para deletar uma máquina
  it('should delete a machine', async () => {
    const createRes = await request(app)
        .post('/maquinas')
        .set('Authorization', `Bearer ${token}`)
        .send({
            nome: 'Máquina para Deletar',
            patrimonio: 'PAT-DEL-001',
            status: 'Ativa'
        });
    expect(createRes.statusCode).toBe(201);
    const newMachineId = createRes.body.id;
  
    const res = await request(app)
      .delete(`/maquinas/${newMachineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);

    // Verify it's actually deleted
    const getRes = await request(app)
        .get(`/maquinas/${newMachineId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toEqual(404);
  });
});
