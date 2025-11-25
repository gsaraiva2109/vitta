// api/tests/loadEnv.js
import dotenv from 'dotenv';
import path from 'path';

// Determina o caminho para o diretório 'api'
// __dirname não é disponível em ES Modules, então usamos import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Carrega as variáveis de ambiente do arquivo .env.test localizado em /api
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
