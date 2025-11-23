import type { Maintenance } from '../models/Maintenance';
import * as api from '../services/manutencaoService';
import { isoToBR, brToISO } from './machinesApiController'; // Re-use date helpers

type ApiMaintenance = {
  idManutencao?: number | string;
  id?: number | string;
  maquina?: { nome?: string };
  tipoManutencao?: Maintenance['type'];
  responsavel?: string;
  empresa?: string;
  custo?: number;
  dataRealizada?: string;
  dataProxima?: string;
  statusManutencao?: Maintenance['status'];
  rcOc?: string;
  observacoes?: string;
};

// Maps an API record to the frontend Maintenance model
const mapApiToMaintenance = (m: ApiMaintenance): Maintenance => {
  const id = m.idManutencao ?? m.id;
  
  return {
    id: id ? String(id) : '',
    machineName: m.maquina?.nome ?? '', // Assumes machine name is nested
    type: m.tipoManutencao ?? 'N/A',
    responsible: m.responsavel ?? 'N/A',
    company: m.empresa ?? '',
    cost: m.custo ?? 0,
    performedDate: m.dataRealizada ? isoToBR(m.dataRealizada.split('T')[0]) : '',
    nextDate: m.dataProxima ? isoToBR(m.dataProxima.split('T')[0]) : '',
    status: m.statusManutencao ?? 'Pendente',
    rcOc: m.rcOc ?? '',
    observacoes: m.observacoes ?? '',
  };
};

// Maps a frontend Maintenance model to an API payload
type ApiMaintenancePayload = {
  idMaquina?: string;
  tipoManutencao?: Maintenance['type'];
  responsavel?: string;
  empresa?: string;
  custo?: number;
  dataRealizada?: string;
  dataProxima?: string;
  statusManutencao?: Maintenance['status'];
  rcOc?: string;
  observacoes?: string;
};

const mapMaintenanceToApi = (m: Partial<Maintenance>): ApiMaintenancePayload => {
    const payload: ApiMaintenancePayload = {};
    if (m.machineName) payload.idMaquina = m.machineName; // Assuming we send machine ID
    if (m.type) payload.tipoManutencao = m.type;
    if (m.responsible) payload.responsavel = m.responsible;
    if (m.company) payload.empresa = m.company;
    if (m.cost) payload.custo = m.cost;
    if (m.performedDate) payload.dataRealizada = brToISO(m.performedDate);
    if (m.nextDate) payload.dataProxima = brToISO(m.nextDate);
    if (m.status) payload.statusManutencao = m.status;
    if (m.rcOc) payload.rcOc = m.rcOc;
    if (m.observacoes) payload.observacoes = m.observacoes;
    return payload;
};

export const loadMaintenancesFromAPI = async (): Promise<Maintenance[]> => {
  try {
    const res = await api.getAllManutencoes();
    return Array.isArray(res) ? res.map(mapApiToMaintenance) : [];
  } catch (error) {
    console.error('Error loading maintenances:', error);
    throw error;
  }
};

export const createMaintenanceAPI = async (data: Omit<Maintenance, 'id'>): Promise<Maintenance> => {
    try {
        const payload = mapMaintenanceToApi(data as Partial<Maintenance>);
        const res = await api.createManutencao(payload);
        return mapApiToMaintenance(res);
    } catch (error) {
        console.error('Error creating maintenance:', error);
        throw error;
    }
};

export const updateMaintenanceAPI = async (id: number, data: Partial<Maintenance>): Promise<Maintenance> => {
    try {
        const payload = mapMaintenanceToApi(data as Partial<Maintenance>);
        const res = await api.updateManutencao(id, payload);
        return mapApiToMaintenance(res);
    } catch (error) {
        console.error('Error updating maintenance:', error);
        throw error;
    }
};

export const deleteMaintenanceAPI = async (id: number): Promise<void> => {
  try {
    await api.deleteManutencao(id);
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    throw error;
  }
};
