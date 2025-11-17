// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB} from './config/database.js';

import './models/index.js';

import { publicUserRouter, protectedUserRouter } from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import maquinaRoutes from './routes/maquinaRoutes.js';
import manutencaoRoutes from './routes/manutencaoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();
console.log('Environment variables loaded.');

const app = express();
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('API do Sistema de Agendamentos Online');
  });


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
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    caminho: req.originalUrl
  });
});
  
connectDB().then(() => {
  console.log('Database connected successfully.');
}).catch(err => {
  console.error('Database connection failed:', err.message, err.stack);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});