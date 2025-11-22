import { Manutencao, Maquina } from '../models/index.js';
import { maquinaService } from './maquinaService.js';

async function getAllManutencoes() {
  return Manutencao.findAll({
    include: [{
      model: Maquina,
      as: 'maquina',
      attributes: ['idMaquina', 'nome', 'patrimonio']
    }]
  });
}

async function getManutencaoById(id) {
  const manutencao = await Manutencao.findByPk(id, {
    include: [{
      model: Maquina,
      as: 'maquina',
      attributes: ['idMaquina', 'nome', 'patrimonio']
    }]
  });
  if (!manutencao) {
    throw new Error('Manutenção não encontrada');
  }
  return manutencao;
}

async function createManutencao(data) {
  // Garante que a máquina associada existe
  await maquinaService.getMaquinaById(data.idMaquina);
  return Manutencao.create(data);
}

async function updateManutencao(id, data) {
  const manutencao = await getManutencaoById(id);
  // Se o ID da máquina for alterado, verifica se a nova máquina existe
  if (data.idMaquina && data.idMaquina !== manutencao.idMaquina) {
    await maquinaService.getMaquinaById(data.idMaquina);
  }
  await manutencao.update(data);
  return manutencao;
}

async function deleteManutencao(id) {
  const manutencao = await getManutencaoById(id);
  await manutencao.destroy();
}

export const manutencaoService = {
  getAllManutencoes,
  getManutencaoById,
  createManutencao,
  updateManutencao,
  deleteManutencao,
};
