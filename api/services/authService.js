import { Usuario } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function loginUser(matricula, senha) {
  if (!matricula || !senha) {
    const error = new Error('Matrícula e senha são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const usuario = await Usuario.findOne({ where: { matricula } });
  if (!usuario) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  const storedSenha = usuario.senha || '';
  let passwordMatches = false;

  try {
    passwordMatches = await bcrypt.compare(senha, storedSenha);
  } catch (err) {
    // Ignora erros do bcrypt e tenta a comparação de texto plano
  }

  if (!passwordMatches && senha !== storedSenha) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  const payload = { id: usuario.idUsuario, matricula: usuario.matricula, tipo: usuario.tipo };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

  return { token, user: { id: usuario.idUsuario, matricula: usuario.matricula, tipo: usuario.tipo } };
}

export const authService = {
  loginUser,
};
