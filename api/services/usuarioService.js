import { Usuario } from '../models/index.js';
import bcrypt from 'bcryptjs';

async function getAllUsuarios() {
  return Usuario.findAll();
}

async function getUsuarioById(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  return usuario;
}

async function getUsuarioByMatricula(matricula) {
  const usuario = await Usuario.findOne({ where: { matricula } });
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  return usuario;
}

async function createUsuario(data) {
  const payload = { ...data };
  if (payload.senha) {
    payload.senha = await bcrypt.hash(payload.senha, 10);
  }
  return Usuario.create(payload);
}

async function updateUsuario(id, data) {
  const usuario = await getUsuarioById(id);
  await usuario.update(data);
  return usuario;
}

async function deleteUsuario(id) {
  const usuario = await getUsuarioById(id);
  await usuario.destroy();
}

export const usuarioService = {
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByMatricula,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
