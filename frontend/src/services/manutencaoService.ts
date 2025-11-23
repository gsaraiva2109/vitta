// frontend/src/services/manutencaoService.ts

import { authenticatedFetch } from "./apiService";
import type { Maintenance } from "../models/Maintenance";

// Define um tipo `ApiMaintenance` que possa ser usado internamente no serviço
type ApiMaintenance = Omit<Maintenance, 'id' | 'valor' | 'dataManutencao' | 'dataProxima'> & { 
  id?: number; 
  valor?: string; 
  dataManutencao?: string | null;
  dataProxima?: string | null;
};

const BASE_PATH = "/manutencoes";

/**
 * Funções de Leitura (READ)
 */

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

/**
 * Função de Criação (CREATE)
 */

export function createManutencao(manutencaoData: Partial<ApiMaintenance>): Promise<ApiMaintenance> {
  const { idMaquina } = manutencaoData;
  if (!idMaquina) {
    throw new Error("idMaquina é obrigatório para criar uma manutenção");
  }
  
  return authenticatedFetch<ApiMaintenance>(`/maquinas/${idMaquina}/manutencoes`, {
    method: "POST",
    body: JSON.stringify(manutencaoData),
  });
}

/**
 * Função de Atualização (UPDATE)
 */

export function updateManutencao(
  id: number,
  manutencaoData: Partial<ApiMaintenance>
): Promise<ApiMaintenance> {
  return authenticatedFetch<ApiMaintenance>(`${BASE_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(manutencaoData),
  });
}

/**
 * Função de Deleção (DELETE)
 */

export function deleteManutencao(id: number): Promise<void> {
  return authenticatedFetch<void>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}
