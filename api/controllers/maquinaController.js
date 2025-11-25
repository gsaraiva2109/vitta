import logger from '../config/logger.js';
import { maquinaService } from '../services/maquinaService.js';
import AppError from '../utils/AppError.js';

function toFrontendMachine(maquina) {
  if (!maquina) return null;
  const { idMaquina, ...rest } = maquina.toJSON ? maquina.toJSON() : maquina;
  return { id: idMaquina, ...rest };
}

export async function getAll(req, res, next) {
  try {
    const maquinas = await maquinaService.getAllMaquinas();
    res.json(maquinas.map(toFrontendMachine));
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const maquina = await maquinaService.getMaquinaById(req.params.id);
    if (!maquina) {
      return next(new AppError('Máquina não encontrada', 404));
    }
    res.json(toFrontendMachine(maquina));
  } catch (error) {
    next(error);
  }
}

export async function getByPatrimonio(req, res, next) {
  try {
    const maquina = await maquinaService.getMaquinaByPatrimonio(req.params.patrimonio);
    if (!maquina) {
      return next(new AppError('Máquina não encontrada', 404));
    }
    res.json(toFrontendMachine(maquina));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    logger.info('Creating machine with payload:', req.body);
    const maquina = await maquinaService.createMaquina(req.body);
    logger.info('Machine created successfully:', maquina);
    res.status(201).json(toFrontendMachine(maquina));
  } catch (error) {
    logger.error('Error creating machine:', error);
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const maquina = await maquinaService.updateMaquina(req.params.id, req.body);
    res.json(toFrontendMachine(maquina));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await maquinaService.deleteMaquina(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}