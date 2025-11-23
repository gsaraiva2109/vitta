import type { Machine } from '../models/Machine';
import * as api from '../services/maquinaService';

// Mapeia um registro retornado pela API (que usa campos em PT-br) para o
// formato esperado pelo frontend (`Machine`). Isso evita `undefined` em campos
// como `name`, `patrimony` e garante formatos de data previsíveis.
const mapApiToMachine = (m: any): Machine => {
  const id = m.idMaquina ?? m.id ?? (m.id && String(m.id));
  // dataAquisicao pode vir como Date/ISO string; tentamos extrair YYYY-MM-DD
  const acquisitionISO = m.dataAquisicao
    ? (typeof m.dataAquisicao === 'string' ? m.dataAquisicao.split('T')[0] : null)
    : null;

  return {
    id: id ? String(id) : '',
    nome: m.nome ?? '',
    patrimony: m.patrimonio ?? m.patrimony ?? '',
    status: m.status ?? m.statusMaquina ?? 'Ativo',
    funcao: m.funcao ?? m.funcao ?? '',
    fabricante: m.fabricante ?? m.fabricante ?? '',
    acquisitionDate: acquisitionISO ? isoToBR(acquisitionISO) : (m.acquisitionDate ?? m.dataAquisicao ?? ''),
    location: m.localizacao ?? m.location ?? '',
    maintenanceInterval: m.intervaloManutencao ?? m.maintenanceInterval ?? '',
    calibrationInterval: m.intervaloCalibracao ?? m.calibrationInterval ?? '',
    serialNumber: m.numeroSerie ?? m.serialNumber ?? '',
    modelo: m.modelo ?? '',
    rcOc: m.rcOc ?? '',
    observacoes: m.observacao ?? m.observacoes ?? '',
    justificativaInativo: m.justificativa ?? m.justificativaInativo ?? '',
  } as Machine;
};

/**
 * Carrega máquinas da API
 */
export const loadMachinesFromAPI = async (): Promise<Machine[]> => {
  try {
    const res = await api.getAllMaquinas();
    if (!Array.isArray(res)) return [];
    return res.map(mapApiToMachine);
  } catch (error) {
    console.error('Erro ao carregar máquinas:', error);
    throw error;
  }
};

/**
 * Carrega uma máquina por ID da API
 */
export const loadMachineById = async (id: number): Promise<Machine> => {
  try {
    const res = await api.getMachineById(id);
    return mapApiToMachine(res);
  } catch (error) {
    console.error('Erro ao carregar máquina:', error);
    throw error;
  }
};

/**
 * Cria uma máquina na API
 */
export const createMachineAPI = async (data: Omit<Machine, 'id'>): Promise<Machine> => {
  try {
      const payload = mapMachineToApi(data as Partial<Machine>);
      const res = await api.createMachine(payload);
      return mapApiToMachine(res);
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    throw error;
  }
};

/**
 * Atualiza uma máquina na API
 */
export const updateMachineAPI = async (
  id: number,
  data: Partial<Machine>
): Promise<Machine> => {
  try {
    const payload = mapMachineToApi(data as Partial<Machine>);
    const res = await api.updateMachine(id, payload);
    return mapApiToMachine(res);
  } catch (error) {
    console.error('Erro ao atualizar máquina:', error);
    throw error;
  }
};

/**
 * Deleta uma máquina da API
 */
export const deleteMachineAPI = async (id: number): Promise<void> => {
  try {
    return await api.deleteMachine(id);
  } catch (error) {
    console.error('Erro ao deletar máquina:', error);
    throw error;
  }
};

// Helpers de data
export const isoToBR = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export const brToISO = (br: string) => {
  if (!br) return '';
  const [d, m, y] = br.split('/');
  return `${y}-${m}-${d}`;
};

// Mapear payload do frontend para o formato esperado pela API/DB
const mapMachineToApi = (m: Partial<Machine>): any => {
  const obj: any = {};
  if (m.nome !== undefined) obj.nome = m.nome;
  if (m.patrimony !== undefined) obj.patrimonio = m.patrimony;
  if (m.funcao !== undefined) obj.funcao = m.funcao;
  if (m.fabricante !== undefined) obj.fabricante = m.fabricante;
  if (m.modelo !== undefined) obj.modelo = m.modelo;
  if (m.rcOc !== undefined) obj.rcOc = m.rcOc;
  if (m.location !== undefined) obj.localizacao = m.location;
  if (m.observacoes !== undefined) obj.observacao = m.observacoes;
  if (m.justificativaInativo !== undefined) obj.justificativa = m.justificativaInativo;
  if (m.serialNumber !== undefined) obj.numeroSerie = m.serialNumber;
  if (m.maintenanceInterval !== undefined) obj.intervaloManutencao = m.maintenanceInterval;
  if (m.calibrationInterval !== undefined) obj.intervaloCalibracao = m.calibrationInterval;
  if (m.acquisitionDate !== undefined && m.acquisitionDate !== '') {
    // front-end stores acquisitionDate in BR format (dd/mm/yyyy) after isoToBR call
    // convert back to ISO for API (YYYY-MM-DD)
    const iso = brToISO(m.acquisitionDate as string);
    obj.dataAquisicao = iso;
  }
  if (m.status !== undefined) obj.status = m.status;
  return obj;
};
