import { authenticatedFetch } from "./apiService";
import type { Maintenance } from "../models/Maintenance";

type ApiMaintenance = Omit<Maintenance, 'id' | 'valor' | 'dataManutencao' | 'dataProxima'> & { 
  id?: number; 
  valor?: string; 
  dataManutencao?: string | null;
  dataProxima?: string | null;
};

const BASE_PATH = "/manutencoes";

export function getAllManutencoes(): Promise<ApiMaintenance[]> {
  return authenticatedFetch<ApiMaintenance[]>(BASE_PATH, {
    method: "GET",
  });
}

export function getManutencaoById(id: number): Promise<ApiMaintenance> {
  return authenticatedFetch<ApiMaintenance>(`${BASE_PATH}/${id}`, {
    method: "GET",
  });
}

export function createManutencao(manutencaoData: Partial<ApiMaintenance>): Promise<ApiMaintenance> {
  const { idMaquina } = manutencaoData;
  if (!idMaquina) {
    throw new Error("idMaquina é obrigatório para criar uma manutenção");
  }

  // Clone the data and remove idMaquina from the body payload, as it's in the URL
  const bodyPayload = { ...manutencaoData };
  delete bodyPayload.idMaquina;
  
  return authenticatedFetch<ApiMaintenance>(`/maquinas/${idMaquina}/manutencoes`, {
    method: "POST",
    body: JSON.stringify(bodyPayload),
  });
}

export function updateManutencao(
  id: number,
  manutencaoData: Partial<ApiMaintenance>
): Promise<ApiMaintenance> {
  return authenticatedFetch<ApiMaintenance>(`${BASE_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(manutencaoData),
  });
}

export function deleteManutencao(id: number): Promise<void> {
  return authenticatedFetch<void>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}
