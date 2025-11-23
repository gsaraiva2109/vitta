import type { Maintenance } from '../models/Maintenance';
import * as api from '../services/manutencaoService';
import { isoToBR, brToISO } from './machinesApiController'; // Re-use date helpers

// Maps an API record to the frontend Maintenance model
const mapApiToMaintenance = (m: any): Maintenance => {
  const id = m.idManutencao ?? m.id;
  
  return {
    id: id ? String(id) : '',
    idMaquina: m.maquina?.idMaquina ?? '',
    machineName: m.maquina?.nome ?? '', // Assumes machine name is nested
    type: m.tipoManutencao ?? 'N/A',
    responsible: m.responsavel ?? 'N/A',
    company: m.empresaResponsavel ?? '',
    cost: m.valor ?? 0,
    performedDate: m.dataManutencao ? isoToBR(m.dataManutencao.split('T')[0]) : '',
    nextDate: m.dataProxima ? isoToBR(m.dataProxima.split('T')[0]) : '',
    status: m.status ?? 'Pendente',
    rcOc: m.rcOc ?? '',
    observacoes: m.observacao ?? '',
  };
};

// Maps a frontend Maintenance model to an API payload
const mapMaintenanceToApi = (m: Partial<Maintenance>): any => {
    const payload: any = {};
    if (m.idMaquina) payload.idMaquina = m.idMaquina; // Assuming we send machine ID
    if (m.type) payload.tipoManutencao = m.type;
    if (m.responsible) payload.responsavel = m.responsible;
    if (m.company) payload.empresaResponsavel = m.company;
    if (m.cost) payload.valor = m.cost;
    if (m.performedDate) payload.dataManutencao = brToISO(m.performedDate);
    if (m.nextDate) payload.dataProxima = brToISO(m.nextDate);
    if (m.status) payload.status = m.status;
    if (m.rcOc) payload.rcOc = m.rcOc;
    if (m.observacoes) payload.observacao = m.observacoes;
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
