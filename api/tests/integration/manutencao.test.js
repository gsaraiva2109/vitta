import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, startServer, closeServer } from '../../server';
import sequelize from '../../config/database';
import { Maquina, Manutencao, Usuario } from '../../models';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
let token;

// Setup and Teardown for the entire test suite
beforeAll(async () => {
  await startServer();
  // Use `force: true` to drop and recreate tables, ensuring a clean slate
  await sequelize.sync({ force: true });

  // Create a test user and generate a token
  const user = await Usuario.create({
    nome: 'Test User',
    matricula: '12345',
    senha: 'password123',
    tipo: 'manager'
  });
  token = jwt.sign({ id: user.idUsuario, cargo: user.tipo }, JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await closeServer(); // This also closes the DB connection
});

describe('Manutencao Integration Tests', () => {


  test('should calculate the next maintenance date for "Preventiva" type', async () => {
    // 1. Create a machine with a maintenance interval
    const maquina = await Maquina.create({
      nome: 'Test Machine',
      patrimonio: 'TM-001',
      intervaloManutencao: 6, // 6 months interval
      dataAquisicao: new Date(),
      status: 'Ativa',
    });

    // 2. Define the maintenance data
    const maintenanceData = {
      idMaquina: maquina.idMaquina,
      tipoManutencao: 'Preventiva',
      dataManutencao: '2025-01-15T00:00:00.000Z',
      responsavel: 'Test User',
      status: 'Agendada',
    };

    // 3. Make the request to create the maintenance
    const response = await request(app)
      .post('/manutencoes')
      .set('Authorization', `Bearer ${token}`)
      .send(maintenanceData)
      .expect(201);

    // 4. Verify the response
    expect(response.body).toHaveProperty('idManutencao');
    expect(response.body.tipoManutencao).toBe('Preventiva');

    // 5. Check the next maintenance date calculation
    const expectedNextDate = new Date('2025-07-15T00:00:00.000Z');
    const actualNextDate = new Date(response.body.dataProxima);

    expect(actualNextDate.toISOString()).toBe(expectedNextDate.toISOString());
  });

    test('should NOT calculate the next maintenance date for other types', async () => {
    // 1. Create a machine
    const maquina = await Maquina.create({
      nome: 'Another Machine',
      patrimonio: 'AM-002',
      intervaloManutencao: 12,
      dataAquisicao: new Date(),
      status: 'Ativa',
    });

    // 2. Define the maintenance data
    const maintenanceData = {
      idMaquina: maquina.idMaquina,
      tipoManutencao: 'Corretiva',
      dataManutencao: '2025-02-20T00:00:00.000Z',
      dataProxima: null, // Explicitly set to null
      responsavel: 'Test User',
      status: 'Concluída',
    };

    // 3. Make the request
    const response = await request(app)
      .post('/manutencoes')
      .set('Authorization', `Bearer ${token}`)
      .send(maintenanceData)
      .expect(201);

    // 4. Verify that dataProxima is null as it was not a "Preventiva"
    expect(response.body.dataProxima).toBeNull();
  });
});
