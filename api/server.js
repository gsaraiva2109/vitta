// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
 
import { connectDB} from './config/database.js';

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

// rotas protegidas por JWT
app.use('/usuarios', authMiddleware, usuarioRoutes);
app.use('/maquinas', authMiddleware, maquinaRoutes);

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