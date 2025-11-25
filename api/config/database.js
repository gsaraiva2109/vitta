import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './logger.js';
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

export const connectDB = async (retries = 5, delay = 2000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      logger.info('Conectado ao PostgreSQL');
      return; // Success
    } catch (err) {
      logger.error(`Erro ao conectar no PostgreSQL (tentativas restantes: ${retries - 1}):`, err.message);
      retries -= 1;
      if (retries === 0) {
        throw new Error("Não foi possível conectar ao banco de dados após várias tentativas.");
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

export const closeDB = async () => {
  await sequelize.close();
}

export default sequelize;