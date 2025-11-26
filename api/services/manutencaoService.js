import { Manutencao, Maquina } from "../models/index.js";
import { maquinaService } from "./maquinaService.js";
import { calculateNextMaintenanceDate } from "../utils/date.js";

async function getAllManutencoes() {
  return Manutencao.findAll({
    include: [
      {
        model: Maquina,
        as: "maquina",
        attributes: ["idMaquina", "nome", "patrimonio"],
      },
    ],
  });
}

async function getManutencaoById(id) {
  const manutencao = await Manutencao.findByPk(id, {
    include: [
      {
        model: Maquina,
        as: "maquina",
        attributes: ["idMaquina", "nome", "patrimonio"],
      },
    ],
  });
  if (!manutencao) {
    throw new Error("Manutenção não encontrada");
  }
  return manutencao;
}

async function createManutencao(data) {
  const maquina = await maquinaService.getMaquinaById(data.idMaquina);

  if (!maquina) {
    // Lança um erro se a máquina não for encontrada, evitando o crash.
    const error = new Error(`Máquina com ID ${data.idMaquina} não encontrada.`);
    error.statusCode = 404; // Not Found
    throw error;
  }

  const payload = {
    ...data,
    dataManutencao: data.dataManutencao ? new Date(data.dataManutencao) : null,
    dataProxima: data.dataProxima ? new Date(data.dataProxima) : null,
  };

  if (data.tipoManutencao === "Preventiva" && maquina.intervaloManutencao) {
    payload.dataProxima = calculateNextMaintenanceDate(
      payload.dataManutencao,
      maquina.intervaloManutencao
    );
  }

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
    dataManutencao: data.dataManutencao ? new Date(data.dataManutencao) : null,
    dataProxima: data.dataProxima ? new Date(data.dataProxima) : null,
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
