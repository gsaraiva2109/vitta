// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './config/logger.js';

import { connectDB} from './config/database.js';
import { seedUsers } from './config/seed.js';

import './models/index.js';

import { publicUserRouter, protectedUserRouter } from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import maquinaRoutes from './routes/maquinaRoutes.js';
import manutencaoRoutes from './routes/manutencaoRoutes.js';
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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use(limiter);

app.use(cors());
app.use(express.json());

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

// Rota coringa: deve ser a **última**
app.use((req, res, next) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    caminho: req.originalUrl
  });
});

app.use(errorMiddleware);

connectDB().then(async () => {
  logger.info('Database connected successfully.');
  await seedUsers();
}).catch(err => {
  logger.error(`Database connection failed: ${err.message}`, err);
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
  });
}

export default app;