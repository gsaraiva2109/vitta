import type { Machine } from '../models/Machine';
import * as api from '../services/maquinaService';

/**
 * Carrega máquinas da API
 */
export const loadMachinesFromAPI = async (): Promise<Machine[]> => {
  try {
    return await api.getAllMaquinas();
  } catch (error) {
    console.error('Erro ao carregar máquinas:', error);
    throw error;
  }
};

/**
 * Carrega uma máquina por ID da API
 */
export const loadMachineById = async (id: number): Promise<Machine> => {
  try {
    return await api.getMachineById(id);
  } catch (error) {
    console.error('Erro ao carregar máquina:', error);
    throw error;
  }
};

/**
 * Cria uma máquina na API
 */
export const createMachineAPI = async (data: Omit<Machine, 'id'>): Promise<Machine> => {
  try {
    return await api.createMachine(data);
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    throw error;
  }
};

/**
 * Atualiza uma máquina na API
 */
export const updateMachineAPI = async (
  id: number,
  data: Partial<Machine>
): Promise<Machine> => {
  try {
    return await api.updateMachine(id, data);
  } catch (error) {
    console.error('Erro ao atualizar máquina:', error);
    throw error;
  }
};

/**
 * Deleta uma máquina da API
 */
export const deleteMachineAPI = async (id: number): Promise<void> => {
  try {
    return await api.deleteMachine(id);
  } catch (error) {
    console.error('Erro ao deletar máquina:', error);
    throw error;
  }
};

// Helpers de data
export const isoToBR = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export const brToISO = (br: string) => {
  if (!br) return '';
  const [d, m, y] = br.split('/');
  return `${y}-${m}-${d}`;
};
