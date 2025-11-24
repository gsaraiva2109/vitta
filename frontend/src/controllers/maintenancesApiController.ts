import type {
  Maintenance,
  MaintenanceStatus,
  MaintenanceType,
} from "../models/Maintenance";
import * as api from "../services/manutencaoService";
import { isoToBr, brToISO } from "../utils/date";

// Type for the raw API response
interface ApiMaintenance {
  idManutencao?: number;
  id?: number;
  valor?: string;
  status?: MaintenanceStatus;
  tipoManutencao?: MaintenanceType;
  responsavel?: string;
  dataManutencao?: string | null; // ISO date
  dataProxima?: string | null; // ISO date
  empresaResponsavel?: string;
  rcOc?: string;
  modelo?: string;
  observacao?: string;
  idMaquina?: string;
  maquina?: {
    idMaquina: string;
    nome: string;
  };
}

// Maps an API record to the frontend Maintenance model
const mapApiToMaintenance = (m: ApiMaintenance): Maintenance => {
  const id = m.idManutencao ?? m.id;

  return {
    id: id ? String(id) : "",
    idMaquina: m.maquina?.idMaquina ?? "",
    machineName: m.maquina?.nome ?? "",
    tipoManutencao: m.tipoManutencao ?? "N/A",
    responsavel: m.responsavel ?? "N/A",
    empresaResponsavel: m.empresaResponsavel ?? "",
    valor: parseFloat(m.valor || "") || 0,
    dataManutencao: m.dataManutencao ? isoToBr(m.dataManutencao) : "",
    dataProxima: m.dataProxima ? isoToBr(m.dataProxima) : "",
    status: m.status ?? "Pendente",
    rcOc: m.rcOc ?? "",
    observacao: m.observacao ?? "",
  };
};

// Maps a frontend Maintenance model to an API payload
const mapMaintenanceToApi = (
  m: Partial<Maintenance>
): Partial<ApiMaintenance> => {
  return {
    id: m.id ? Number(m.id) : undefined,
    idMaquina: m.idMaquina,
    tipoManutencao: m.tipoManutencao,
    responsavel: m.responsavel,
    empresaResponsavel: m.empresaResponsavel,
    valor: m.valor ? String(m.valor) : undefined,
    dataManutencao: m.dataManutencao?.includes("/")
      ? brToISO(m.dataManutencao)
      : m.dataManutencao,
    dataProxima: m.dataProxima?.includes("/")
      ? brToISO(m.dataProxima)
      : m.dataProxima,
    status: m.status,
    rcOc: m.rcOc,
    observacao: m.observacao,
  };
};

export const loadMaintenancesFromAPI = async (): Promise<Maintenance[]> => {
  try {
    const res: ApiMaintenance[] = await api.getAllManutencoes();
    return Array.isArray(res) ? res.map(mapApiToMaintenance) : [];
  } catch (error) {
    console.error("Error loading maintenances:", error);
    throw error;
  }
};

export const createMaintenanceAPI = async (
  data: Omit<Maintenance, "id">
): Promise<Maintenance> => {
  try {
    const payload = mapMaintenanceToApi(data as Partial<Maintenance>);
    const res = await api.createManutencao(payload);
    return mapApiToMaintenance(res);
  } catch (error) {
    console.error("Error creating maintenance:", error);
    throw error;
  }
};

export const updateMaintenanceAPI = async (
  id: number,
  data: Partial<Maintenance>
): Promise<Maintenance> => {
  try {
    const payload = mapMaintenanceToApi(data as Partial<Maintenance>);
    const res = await api.updateManutencao(id, payload);
    return mapApiToMaintenance(res);
  } catch (error) {
    console.error("Error updating maintenance:", error);
    throw error;
  }
};

export const deleteMaintenanceAPI = async (id: number): Promise<void> => {
  try {
    await api.deleteManutencao(id);
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    throw error;
  }
};
