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
import manutencaoRoutes from './routes/manutencaoRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('API do Sistema de Agendamentos Online');
  });


  // Usar as rotas
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/maquinas', maquinaRoutes);
app.use('/manutencoes', manutencaoRoutes);


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