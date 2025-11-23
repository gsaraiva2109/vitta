import { manutencaoService } from '../services/manutencaoService.js';

export async function getAll(req, res) {
  try {
    const manutencoes = await manutencaoService.getAllManutencoes();
    res.json(manutencoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const manutencao = await manutencaoService.getManutencaoById(req.params.id);
    res.json(manutencao);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function create(req, res) {
  console.log('Dados recebidos para criar manutenção:', req.body);
  try {
    const { idMaquina } = req.params;
    const manutencao = await manutencaoService.createManutencao({ 
      ...req.body, 
      idMaquina: parseInt(idMaquina, 10) 
    });
    res.status(201).json(manutencao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const manutencao = await manutencaoService.updateManutencao(req.params.id, req.body);
    res.json(manutencao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    await manutencaoService.deleteManutencao(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
