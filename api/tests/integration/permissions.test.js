import request from 'supertest';
import { app } from '../../server.js';
import { sequelize } from '../../models/index.js';
import { closeDB } from '../../config/database.js';

let managerToken;
let userToken;
let testMachine;
let testMaintenance;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create a manager and a user
  await request(app)
    .post('/usuarios')
    .send({ matricula: 'manager_perm', senha: '123', tipo: 'manager' });
  await request(app)
    .post('/usuarios')
    .send({ matricula: 'user_perm', senha: '123', tipo: 'user' });

  // Login as manager and user to get tokens
  const managerLoginRes = await request(app)
    .post('/auth/login')
    .send({ matricula: 'manager_perm', senha: '123' });
  managerToken = managerLoginRes.body.token;

  const userLoginRes = await request(app)
    .post('/auth/login')
    .send({ matricula: 'user_perm', senha: '123' });
  userToken = userLoginRes.body.token;

  // Create a test machine
  const machineRes = await request(app)
    .post('/maquinas')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      nome: 'Test Machine for Permissions',
      patrimonio: 'PERM-001',
      status: 'Ativo',
    });
  testMachine = machineRes.body;

  // Create a test maintenance
  const maintenanceRes = await request(app)
    .post('/manutencoes')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      idMaquina: testMachine.id,
      valor: 100.0,
      status: 'Concluída',
      tipoManutencao: 'Preventiva',
      responsavel: 'Test Guy',
    });
  testMaintenance = maintenanceRes.body;
});

describe('Permission Control', () => {
  // Test Machine routes
  it('user should be able to create a machine', async () => {
    const res = await request(app)
      .post('/maquinas')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nome: 'User Created Machine',
        patrimonio: 'USER-001',
        status: 'Ativo',
      });
    expect(res.statusCode).toEqual(201);
  });

  it('user should not be able to update a machine', async () => {
    const res = await request(app)
      .put(`/maquinas/${testMachine.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nome: 'Updated by User' });
    expect(res.statusCode).toEqual(403);
  });

  it('user should not be able to delete a machine', async () => {
    const res = await request(app)
      .delete(`/maquinas/${testMachine.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
  });

  it('manager should be able to update a machine', async () => {
    const res = await request(app)
      .put(`/maquinas/${testMachine.id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ nome: 'Updated by Manager' });
    expect(res.statusCode).toEqual(200);
  });

  it('manager should be able to delete a machine', async () => {
    // Create a machine to be deleted
    const machineToDeleteRes = await request(app)
      .post('/maquinas')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        nome: 'Machine to Delete',
        patrimonio: 'DEL-001',
        status: 'Ativo',
      });
    const machineIdToDelete = machineToDeleteRes.body.id;

    const res = await request(app)
      .delete(`/maquinas/${machineIdToDelete}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.statusCode).toEqual(204);
  });

  // Test Maintenance routes
  it('user should be able to create a maintenance record', async () => {
    const res = await request(app)
      .post('/manutencoes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        idMaquina: testMachine.id,
        valor: 50.0,
        status: 'Concluída', // Alterado para um status válido
        tipoManutencao: 'Corretiva',
        responsavel: 'User Test',
      });
    expect(res.statusCode).toEqual(201);
  });

  it('user should not be able to update a maintenance record', async () => {
    const res = await request(app)
      .put(`/manutencoes/${testMaintenance.idManutencao}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'Cancelada' });
    expect(res.statusCode).toEqual(403);
  });

  it('user should not be able to delete a maintenance record', async () => {
    const res = await request(app)
      .delete(`/manutencoes/${testMaintenance.idManutencao}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
  });

  it('manager should be able to update a maintenance record', async () => {
    const res = await request(app)
      .put(`/manutencoes/${testMaintenance.idManutencao}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'Em andamento' }); // Alterado para um status válido
    expect(res.statusCode).toEqual(200);
  });

  it('manager should be able to delete a maintenance record', async () => {
    // Create a maintenance record to be deleted
    const maintenanceToDeleteRes = await request(app)
      .post('/manutencoes')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        idMaquina: testMachine.id,
        valor: 200.0,
        status: 'Concluída', // Alterado para um status válido
        tipoManutencao: 'Corretiva',
        responsavel: 'Delete Test',
      });
    const maintenanceIdToDelete = maintenanceToDeleteRes.body.idManutencao;
    
    const res = await request(app)
      .delete(`/manutencoes/${maintenanceIdToDelete}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.statusCode).toEqual(204);
  });
});

afterAll(async () => {
  await closeDB();
});
