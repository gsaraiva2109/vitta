import { authenticatedFetch } from "./apiService";
import type { Machine } from "../models/Machine";

const BASE_PATH = "/maquinas";

export function getAllMaquinas(): Promise<Machine[]> {
  return authenticatedFetch<Machine[]>(BASE_PATH, {
    method: "GET",
  });
}

export function getMachineById(id: number): Promise<Machine> {
  return authenticatedFetch<Machine>(`${BASE_PATH}/${id}`, {
    method: "GET",
  });
}

export function createMachine(maquinaData: Partial<Machine>): Promise<Machine> {
  return authenticatedFetch<Machine>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(maquinaData),
  });
}

export function updateMachine(
  id: number,
  maquinaData: Partial<Machine>
): Promise<Machine> {
  return authenticatedFetch<Machine>(`${BASE_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(maquinaData),
  });
}

export function deleteMachine(id: number): Promise<void> {
  return authenticatedFetch<void>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}
