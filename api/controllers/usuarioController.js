import { usuarioService } from '../services/usuarioService.js';

export async function getAll(req, res) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function getByMatricula(req, res) {
  try {
    const usuario = await usuarioService.getUsuarioByMatricula(req.params.matricula);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const usuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const usuario = await usuarioService.updateUsuario(req.params.id, req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    await usuarioService.deleteUsuario(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
