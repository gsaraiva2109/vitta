// frontend/src/services/maquinaService.ts

import { authenticatedFetch } from "./apiService";
import type { Machine } from "../models/Machine"; // Tipo corrigido

const BASE_PATH = "/maquinas"; // Rota base no backend (/api/maquinas)

/**
 * Funções de Leitura (READ)
 */

// 1. GET ALL: Busca todas as máquinas (GET /api/maquinas)
export function getAllMaquinas(): Promise<Machine[]> {
  return authenticatedFetch<Machine[]>(BASE_PATH, {
    method: "GET",
  });
}

// 2. GET BY ID: Busca uma máquina específica pelo ID (GET /api/maquinas/:id)
export function getMachineById(id: number): Promise<Machine> {
  return authenticatedFetch<Machine>(`${BASE_PATH}/${id}`, {
    method: "GET",
  });
}

/**
 * Função de Criação (CREATE)
 */

// 3. CREATE: Cria uma nova máquina (POST /api/maquinas)
export function createMachine(maquinaData: Partial<Machine>): Promise<Machine> {
  return authenticatedFetch<Machine>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(maquinaData),
  });
}

/**
 * Função de Atualização (UPDATE)
 */

// 4. UPDATE: Atualiza uma máquina existente (PUT /api/maquinas/:id)
export function updateMachine(
  id: number,
  maquinaData: Partial<Machine>
): Promise<Machine> {
  return authenticatedFetch<Machine>(`${BASE_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(maquinaData),
  });
}

/**
 * Função de Deleção (DELETE)
 */

// 5. DELETE: Remove uma máquina (DELETE /api/maquinas/:id)
// Retorna um Promise<void> ou um objeto de status vazio, pois o backend retorna 204 (No Content)
export function deleteMachine(id: number): Promise<void> {
  return authenticatedFetch<void>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}
