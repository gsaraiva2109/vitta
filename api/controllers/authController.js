import { Usuario } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export async function login(req, res) {
  const { matricula, senha } = req.body;
  if (!matricula || !senha) return res.status(400).json({ message: 'matricula e senha são obrigatórios' });

  try {
    const usuario = await Usuario.findOne({ where: { matricula } });
    if (!usuario) return res.status(401).json({ message: 'Credenciais inválidas' });

    const stored = usuario.senha || '';
    let passwordMatches = false;

    console.log('Attempting password comparison...');

    try {
      passwordMatches = await bcrypt.compare(senha, stored);
      console.log('Bcrypt comparison result:', passwordMatches);
    } catch (err) {
      console.error('Bcrypt comparison error (ignored for fallback):', err.message);
    }

    if (!passwordMatches) {
      if (senha === stored) {
        passwordMatches = true;
        console.log('Plain text comparison successful.');
      } else {
        console.log('Plain text comparison failed.');
      }
    }

    if (!passwordMatches) return res.status(401).json({ message: 'Credenciais inválidas' });

    console.log('Password matches. Generating token...');

    // Assinar token JWT simples
    const payload = { id: usuario.idUsuario, matricula: usuario.matricula };
    console.log('JWT Payload:', payload);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    console.log('JWT Token generated.');

    res.json({ token, user: { id: usuario.idUsuario, matricula: usuario.matricula } });
  } catch (error) {
    console.error('Erro login:', error.message, error.stack);
    console.log({ matricula, senha: '[REDACTED]' }); // Log input but redact sensitive info
    res.status(500).json({ message: 'Erro interno' });
  }
}
