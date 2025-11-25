import { authenticatedFetch } from "./apiService";
import type { User } from "../models/User";

const BASE_PATH = "/usuarios";

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

export function createUsuario(usuarioData: Partial<User>): Promise<User> {
  return authenticatedFetch<User>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(usuarioData),
  });
}

export function updateUsuario(
  id: number,
  usuarioData: Partial<User>
): Promise<User> {
  return authenticatedFetch<User>(`${BASE_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(usuarioData),
  });
}


export function deleteUsuario(id: number): Promise<void> {
  return authenticatedFetch<void>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}
