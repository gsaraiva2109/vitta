// frontend/src/services/manutencaoService.ts

import { authenticatedFetch } from "./apiService";
import type { Maintenance } from "../models/Maintenance";

const BASE_PATH = "/manutencoes";

/**
 * Funções de Leitura (READ)
 */

export function getAllManutencoes(): Promise<Maintenance[]> {
  return authenticatedFetch<Maintenance[]>(BASE_PATH, {
    method: "GET",
  });
}

export function getManutencaoById(id: number): Promise<Maintenance> {
  return authenticatedFetch<Maintenance>(`${BASE_PATH}/${id}`, {
    method: "GET",
  });
}

/**
 * Função de Criação (CREATE)
 */

export function createManutencao(manutencaoData: Partial<Maintenance>): Promise<Maintenance> {
  return authenticatedFetch<Maintenance>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(manutencaoData),
  });
}

/**
 * Função de Atualização (UPDATE)
 */

export function updateManutencao(
  id: number,
  manutencaoData: Partial<Maintenance>
): Promise<Maintenance> {
  return authenticatedFetch<Maintenance>(`${BASE_PATH}/${id}`, {
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
