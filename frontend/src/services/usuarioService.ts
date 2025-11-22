// frontend/src/services/usuarioService.ts

import { authenticatedFetch } from "./apiService";
import type { User } from "../models/User";

const BASE_PATH = "/usuarios";

/**
 * Funções de Leitura (READ)
 */

export function getAllUsuarios(): Promise<User[]> {
  return authenticatedFetch<User[]>(BASE_PATH, {
    method: "GET",
  });
}

export function getUsuarioById(id: number): Promise<User> {
  return authenticatedFetch<User>(`${BASE_PATH}/${id}`, {
    method: "GET",
  });
}

export function getUsuarioByMatricula(matricula: string): Promise<User> {
    return authenticatedFetch<User>(`${BASE_PATH}/matricula/${matricula}`, {
      method: "GET",
    });
  }

/**
 * Função de Criação (CREATE)
 */

export function createUsuario(usuarioData: Partial<User>): Promise<User> {
  return authenticatedFetch<User>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(usuarioData),
  });
}

/**
 * Função de Atualização (UPDATE)
 */

export function updateUsuario(
  id: number,
  usuarioData: Partial<User>
): Promise<User> {
  return authenticatedFetch<User>(`${BASE_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(usuarioData),
  });
}

/**
 * Função de Deleção (DELETE)
 */

export function deleteUsuario(id: number): Promise<void> {
  return authenticatedFetch<void>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}
