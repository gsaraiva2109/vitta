import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const commonOptions = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {}
};

// Ativa SSL automaticamente para hosts do Render (ou se DB_SSL=true)
if ((process.env.DB_URL && process.env.DB_URL.includes('render.com')) || process.env.DB_SSL === 'true') {
  commonOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, commonOptions) : new Sequelize({
      ...commonOptions,
      host: process.env.DB_HOST || 'localhost',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432
    });

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao PostgreSQL');
  } catch (err) {
    console.error('Erro ao conectar no PostgreSQL:', err);
    throw err; // Propaga o erro para parar o servidor se falhar
  }
};

export default sequelize;