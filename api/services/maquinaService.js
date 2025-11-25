import { Maquina } from '../models/index.js';

async function getAllMaquinas() {
  return Maquina.findAll();
}

async function getMaquinaById(id) {
  return Maquina.findByPk(id);
}

async function getMaquinaByPatrimonio(patrimonio) {
  const maquina = await Maquina.findOne({ where: { patrimonio } });
  if (!maquina) {
    throw new Error('Máquina não encontrada');
  }
  return maquina;
}

async function createMaquina(data) {
  const existing = await Maquina.findOne({ where: { patrimonio: data.patrimonio } });
  if (existing) {
    throw new Error('Patrimônio já cadastrado.');
  }
  return Maquina.create(data);
}

async function updateMaquina(id, data) {
  const maquina = await getMaquinaById(id);
  await maquina.update(data);
  return maquina;
}

async function deleteMaquina(id) {
  const maquina = await getMaquinaById(id);
  await maquina.destroy();
}

export const maquinaService = {
  getAllMaquinas,
  getMaquinaById,
  getMaquinaByPatrimonio,
  createMaquina,
  updateMaquina,
  deleteMaquina,
};
