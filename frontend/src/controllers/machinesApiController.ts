import type { Machine } from '../models/Machine';
import * as api from '../services/maquinaService';
import { handleApiError } from '../utils/handleApiError';

type ApiMachine = {
  idMaquina?: number | string;
  id?: number | string;
  nome?: string;
  name?: string;
  patrimonio?: string;
  patrimony?: string;
  status?: Machine['status'];
  statusMaquina?: Machine['status'];
  funcao?: string;
  fabricante?: string;
  dataAquisicao?: string;
  acquisitionDate?: string;
  localizacao?: string;
  location?: string;
  intervaloManutencao?: string;
  maintenanceInterval?: string;
  intervaloCalibracao?: string;
  calibrationInterval?: string;
  numeroSerie?: string;
  serialNumber?: string;
  modelo?: string;
  rcOc?: string;
  observacao?: string;
  observacoes?: string;
  justificativa?: string;
  justificativaInativo?: string;
};

const mapApiToMachine = (m: ApiMachine): Machine => {
  const id = m.idMaquina ?? m.id ?? (m.id && String(m.id));
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

export const loadMachinesFromAPI = async (): Promise<Machine[]> => {
  try {
    const res = await api.getAllMaquinas();
    if (!Array.isArray(res)) return [];
    return res.map(mapApiToMachine);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const loadMachineById = async (id: number): Promise<Machine> => {
  try {
    const res = await api.getMachineById(id);
    return mapApiToMachine(res);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const createMachineAPI = async (data: Omit<Machine, 'id'>): Promise<Machine> => {
  try {
      const payload = mapMachineToApi(data as Partial<Machine>);
      const res = await api.createMachine(payload);
      return mapApiToMachine(res);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateMachineAPI = async (
  id: number,
  data: Partial<Machine>
): Promise<Machine> => {
  try {
    const payload = mapMachineToApi(data as Partial<Machine>);
    const res = await api.updateMachine(id, payload);
    return mapApiToMachine(res);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const deleteMachineAPI = async (id: number): Promise<void> => {
  try {
    return await api.deleteMachine(id);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

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

type ApiMachinePayload = {
  nome?: string;
  patrimonio?: string;
  funcao?: string;
  fabricante?: string;
  modelo?: string;
  rcOc?: string;
  localizacao?: string;
  observacao?: string;
  justificativa?: string;
  numeroSerie?: string;
  intervaloManutencao?: string;
  intervaloCalibracao?: string;
  dataAquisicao?: string;
  status?: Machine['status'];
};

const mapMachineToApi = (m: Partial<Machine>): ApiMachinePayload => {
  const obj: ApiMachinePayload = {};
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
  if (m.acquisitionDate) {
    const isoDate = m.acquisitionDate.includes('/') ? brToISO(m.acquisitionDate) : m.acquisitionDate;
    obj.dataAquisicao = isoDate;
  }
  if (m.status !== undefined) obj.status = m.status;
  return obj;
};
