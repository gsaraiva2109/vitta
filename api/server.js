// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
 
import { connectDB} from './config/database.js';

// carregar modelos e associações
import './models/index.js';

// Importando Rotas
import usuarioRoutes from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import maquinaRoutes from './routes/maquinaRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();
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
  
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});