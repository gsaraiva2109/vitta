import { maquinaService } from '../services/maquinaService.js';

export async function getAll(req, res) {
  try {
    const maquinas = await maquinaService.getAllMaquinas();
    res.json(maquinas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const maquina = await maquinaService.getMaquinaById(req.params.id);
    res.json(maquina);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function getByPatrimonio(req, res) {
  try {
    const maquina = await maquinaService.getMaquinaByPatrimonio(req.params.patrimonio);
    res.json(maquina);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const maquina = await maquinaService.createMaquina(req.body);
    res.status(201).json(maquina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const maquina = await maquinaService.updateMaquina(req.params.id, req.body);
    res.json(maquina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    await maquinaService.deleteMaquina(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}