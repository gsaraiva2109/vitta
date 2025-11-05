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

    // Primeiro tente comparar com hash (bcrypt). Se a senha no BD for plain text, também tente comparação direta.
    try {
      passwordMatches = await bcrypt.compare(senha, stored);
    } catch (err) {
      // ignore
    }
    if (!passwordMatches) {
      // fallback plain comparison
      if (senha === stored) passwordMatches = true;
    }

    if (!passwordMatches) return res.status(401).json({ message: 'Credenciais inválidas' });

    // Assinar token JWT simples
    const payload = { id: usuario.idUsuario, matricula: usuario.matricula };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: { id: usuario.idUsuario, matricula: usuario.matricula } });
  } catch (error) {
    console.error('Erro login:', error);
    res.status(500).json({ message: 'Erro interno' });
  }
}
