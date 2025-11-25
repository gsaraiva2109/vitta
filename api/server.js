import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import logger from './config/logger.js';

import { connectDB, default as sequelize } from './config/database.js';
import { seedUsers } from './config/seed.js';



import { publicUserRouter, protectedUserRouter } from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import maquinaRoutes from './routes/maquinaRoutes.js';
import manutencaoRoutes from './routes/manutencaoRoutes.js';

import reportRoutes from './routes/reportRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';

dotenv.config();
logger.info('Environment variables loaded.');

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: 'Muitas requisições deste IP, tente novamente mais tarde.'
// });
// app.use(limiter);

app.use(cors());
app.use(express.json());

// Middleware to disable caching for all API responses
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Swagger UI documentation at root (mapped to /api/ public via proxy)
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(specs));

// Usar as rotas
// rota de auth (login) fica pública
app.use('/auth', authRoutes);

// Rotas públicas de usuário
app.use('/usuarios', publicUserRouter);

// rotas protegidas por JWT
app.use('/usuarios', authMiddleware, protectedUserRouter); // Rotas de usuário protegidas
app.use('/maquinas', authMiddleware, maquinaRoutes);
app.use('/manutencoes', authMiddleware, manutencaoRoutes);
app.use('/reports', authMiddleware, reportRoutes);

// Rota coringa: deve ser a **última**
app.use((req, res, _next) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    caminho: req.originalUrl
  });
});

app.use(errorMiddleware);

let server;

const startServer = async () => {
  await connectDB();
  logger.info('Database connected successfully.');

  // Importar e inicializar modelos APÓS a conexão
  const { Usuario } = await import('./models/index.js');
  
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const syncOptions = { alter: true };
    await sequelize.sync(syncOptions);
    logger.info(`Models synchronized (sequelize.sync: ${JSON.stringify(syncOptions)})`);
  }
  
  // Seed users only if not in test environment
  if (process.env.NODE_ENV !== 'test') {
    await seedUsers(Usuario);
  }

  const PORT = process.env.PORT || 3000;
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
      resolve(server);
    });
  });
};

const closeServer = async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          return reject(err);
        }
        logger.info('Server closed.');
        resolve();
      });
    });
  }
  await sequelize.close();
  logger.info('Database connection closed.');
};

if (process.env.NODE_ENV !== 'test') {
  startServer().catch(err => {
    logger.error(`Server failed to start: ${err.message}`, err);
    process.exit(1);
  });
}

export { app, startServer, closeServer, server };

