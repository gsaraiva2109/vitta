import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Maquina, Manutencao, Usuario } from '../models/index.js';

export const seedData = async () => {

  try {
    const userCount = await Usuario.count();
    if (process.env.NODE_ENV === 'production' || userCount > 0) {
      console.log('Skipping seeding. Production environment or data already exists.');
      return;
    }

    console.log('Seeding default data...');

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    await Usuario.bulkCreate([
      { matricula: 'admin', senha: hashedPassword, tipo: 'manager' },
      { matricula: 'user', senha: hashedPassword, tipo: 'user' },
      { matricula: 'testuser', senha: hashedPassword, tipo: 'user' }
    ]);
    console.log('Default users created.');

    // 2. Seed Machines
    const maquinas = [];
    for (let i = 1; i <= 10; i++) {
      maquinas.push({
        id: i,
        nome: `Máquina ${i}`,
        patrimonio: `VITTA-00${i}`,
        status: 'Ativo',
        funcao: 'Prensa',
        fabricante: 'Fabricante Padrão',
        dataAquisicao: new Date('2023-01-01'),
        intervaloManutencao: 30 // Intervalo em DIAS
      });
    }
    await Maquina.bulkCreate(maquinas);
    console.log('Default machines created.');

    // 3. Seed Maintenances to Trigger Alerts
    const manutencoes = [
      // Alerta Vencido (hoje é 26/11/2025)
      { idMaquina: 1, dataManutencao: '2025-10-25', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vencida.' },
      // Alerta Vence Hoje
      { idMaquina: 2, dataManutencao: '2025-10-27', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence hoje.' },
      // Alerta Vence em 1 dia
      { idMaquina: 3, dataManutencao: '2025-10-28', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence em 1 dia.' },
      // Alerta Vence em 7 dias
      { idMaquina: 4, dataManutencao: '2025-11-03', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence em 7 dias.' },
       // Alerta Vence em 10 dias
      { idMaquina: 5, dataManutencao: '2025-11-06', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence em 10 dias.' },
      // Alerta Vence em 15 dias
      { idMaquina: 6, dataManutencao: '2025-11-11', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence em 15 dias.' },
      // Alerta Vence em 20 dias
      { idMaquina: 7, dataManutencao: '2025-11-16', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence em 20 dias.' },
      // Alerta Vence em 25 dias
      { idMaquina: 8, dataManutencao: '2025-11-21', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence em 25 dias.' },
      // Alerta Vence em 29 dias
      { idMaquina: 9, dataManutencao: '2025-11-25', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção vence em 29 dias.' },
      // Manutenção futura, não deve gerar alerta
      { idMaquina: 10, dataManutencao: '2025-11-26', tipo: 'Preventiva', status: 'Concluída', custo: 100, responsavel: 'Admin', descricao: 'Manutenção recente, sem alerta.' }
    ];
    await Manutencao.bulkCreate(manutencoes);
    console.log('Default maintenances created to trigger alerts.');


    console.log('✅ Default data seeding complete.');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};


