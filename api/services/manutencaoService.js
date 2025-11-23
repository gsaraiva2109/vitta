import { Manutencao, Maquina } from '../models/index.js';
import { maquinaService } from './maquinaService.js';
import { parseISO } from 'date-fns';

const toDate = (dateString) => {
  if (!dateString) return null;
  try {
    return parseISO(dateString);
  } catch (error) {
    console.error(`Invalid date format: ${dateString}`, error);
    return null;
  }
};

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
  
  const payload = {
    ...data,
    idMaquina: data.idMaquina,
    dataManutencao: toDate(data.dataManutencao),
    dataProxima: toDate(data.dataProxima),
  };

  const novaManutencao = await Manutencao.create(payload);
  return getManutencaoById(novaManutencao.idManutencao);
}

async function updateManutencao(id, data) {
  const manutencao = await getManutencaoById(id);
  // Se o ID da máquina for alterado, verifica se a nova máquina existe
  if (data.idMaquina && data.idMaquina !== manutencao.idMaquina) {
    await maquinaService.getMaquinaById(data.idMaquina);
  }

  const payload = {
    ...data,
    dataManutencao: toDate(data.dataManutencao),
    dataProxima: toDate(data.dataProxima),
  };

  await manutencao.update(payload);
  return getManutencaoById(id);
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
