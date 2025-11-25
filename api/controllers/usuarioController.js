import { usuarioService } from '../services/usuarioService.js';
import AppError from '../utils/AppError.js';

export async function getAll(req, res, next) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    if (!usuario) {
      return next(new AppError('Usuário não encontrado', 404));
    }
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function getByMatricula(req, res, next) {
  try {
    const usuario = await usuarioService.getUsuarioByMatricula(req.params.matricula);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const usuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400); // Set status for middleware if needed, or throw custom error
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const usuario = await usuarioService.updateUsuario(req.params.id, req.body);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await usuarioService.deleteUsuario(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

