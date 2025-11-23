import type { Maintenance, MaintenanceStatus, MaintenanceType } from '../models/Maintenance';
import * as api from '../services/manutencaoService';
import { isoToBr, brToISO } from '../utils/date'; 

// Type for the raw API response
interface ApiMaintenance {
    idManutencao?: number;
    id?: number;
    valor?: string;
    status?: MaintenanceStatus;
    tipoManutencao?: MaintenanceType;
    responsavel?: string;
    dataManutencao?: string; // ISO date
    empresaResponsavel?: string;
    rcOc?: string;
    modelo?: string;
    observacao?: string;
    idMaquina?: string;
    maquina?: {
        idMaquina: string;
        nome: string;
    }
}

// Maps an API record to the frontend Maintenance model
const mapApiToMaintenance = (m: ApiMaintenance): Maintenance => {
  const id = m.idManutencao ?? m.id;
  
  return {
    id: id ? String(id) : '',
    idMaquina: m.maquina?.idMaquina ?? '',
    machineName: m.maquina?.nome ?? '', 
    tipoManutencao: m.tipoManutencao ?? 'N/A',
    responsavel: m.responsavel ?? 'N/A',
    empresaResponsavel: m.empresaResponsavel ?? '',
    valor: parseFloat(m.valor || '') || 0,
    dataManutencao: m.dataManutencao ? isoToBr(m.dataManutencao) : '',
    dataProxima: (m as any).dataProxima ? isoToBr((m as any).dataProxima) : '', // Backend model needs dataProxima
    status: m.status ?? 'Pendente',
    rcOc: m.rcOc ?? '',
    observacao: m.observacao ?? '',
  };
};

// Maps a frontend Maintenance model to an API payload
const mapMaintenanceToApi = (m: Partial<Maintenance>): Partial<ApiMaintenance> => {
    const payload: Partial<ApiMaintenance> = {};
    if (m.idMaquina) payload.idMaquina = m.idMaquina;
    if (m.tipoManutencao) payload.tipoManutencao = m.tipoManutencao;
    if (m.responsavel) payload.responsavel = m.responsavel;
    if (m.empresaResponsavel) payload.empresaResponsavel = m.empresaResponsavel;
    if (m.valor) payload.valor = String(m.valor);
    if (m.dataManutencao) payload.dataManutencao = brToISO(m.dataManutencao);
    if (m.dataProxima) (payload as any).dataProxima = brToISO(m.dataProxima); // Backend model needs dataProxima
    if (m.status) payload.status = m.status;
    if (m.rcOc) payload.rcOc = m.rcOc;
    if (m.observacao) payload.observacao = m.observacao;
    
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
