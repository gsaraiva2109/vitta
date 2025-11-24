import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';

export const seedUsers = async () => {
  try {
    const count = await Usuario.count();
    if (process.env.NODE_ENV === 'production' || count > 0) {
      return;
    }

    console.log('Seeding default users...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    await Usuario.bulkCreate([
      {
        matricula: 'admin',
        senha: hashedPassword,
        tipo: 'manager'
      },
      {
        matricula: 'user',
        senha: hashedPassword,
        tipo: 'user'
      }
    ]);

    console.log('Default users created:');
    console.log('1. Admin (Manager) -> Matricula: admin, Senha: 123');
    console.log('2. User (Normal)   -> Matricula: user, Senha: 123');

  } catch (error) {
    console.error('Error seeding users:', error);
  }
};
