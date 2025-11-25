import request from 'supertest';
import { app, startServer, closeServer } from '../../server.js';
import { Usuario } from '../../models/index.js';

let token;

describe('Report Routes Integration Tests', () => {
  beforeAll(async () => {
    await startServer();

    // Create a user to authenticate requests
    await Usuario.create({
      matricula: 'report-tester',
      senha: 'password123',
      tipo: 'manager',
    });
    
    // Login to get a token
    const res = await request(app)
      .post('/auth/login')
      .send({
        matricula: 'report-tester',
        senha: 'password123',
      });
    token = res.body.token;
  });

  afterAll(async () => {
    await closeServer();
  });

  it('should export data to Excel', async () => {
    const res = await request(app)
      .post('/reports/export/excel')
      .set('Authorization', `Bearer ${token}`)
      .send([
        {
          codigo: 'M001',
          patrimonio: 'PAT-001',
          nome: 'Torno CNC',
          funcao: 'Usinagem',
          dataAquisicao: '2023-01-15',
          fabricante: 'Fabricante A',
          modelo: 'Modelo X',
          numero: 'SN-12345',
          localizacao: 'Ala 1',
          status: 'Ativo',
          observacoes: 'Nenhuma'
        }
      ]);

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toEqual('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  it('should return 401 for unauthenticated user', async () => {
    const res = await request(app).post('/reports/export/excel');
    expect(res.statusCode).toEqual(401);
  });
});
