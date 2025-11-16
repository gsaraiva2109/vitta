import { Maquina } from '../models/index.js';

export async function getAll(req, res) {
  try {
    const maquinas = await Maquina.findAll();
    res.json(maquinas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const maquina = await Maquina.findByPk(req.params.id);
    if (!maquina) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }
    res.json(maquina);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getByPatrimonio(req, res) {
  try {
    const maquina = await Maquina.findOne({
      where: { patrimonio: req.params.patrimonio }
    });
    
    if (!maquina) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }
    
    res.json(maquina);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const maquina = await Maquina.create(req.body);
    res.status(201).json(maquina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    // Encontrar a instância pela PK (idMaquina) e aplicar mudanças via instance.save()
    const maquina = await Maquina.findByPk(req.params.id);
    if (!maquina) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }

    // Atualiza somente os campos recebidos
    await maquina.update(req.body);
    res.json(maquina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    // Buscar por PK e destruir a instância para evitar usar campo incorreto
    const maquina = await Maquina.findByPk(req.params.id);
    if (!maquina) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }
    await maquina.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}