import type { Machine } from '../models/Machine';

const STORAGE_KEY = 'machines';

export const loadMachines = (seed: Machine[] = []): Machine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Machine[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
};

export const saveMachines = (list: Machine[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const nextId = (list: Machine[]) =>
  `M-${String(list.length + 1).padStart(3, '0')}`;

export const addMachine = (list: Machine[], data: Omit<Machine, 'id'>): Machine[] => {
  const m: Machine = { id: nextId(list), ...data };
  const newList = [...list, m];
  saveMachines(newList);
  return newList;
};

export const updateMachine = (list: Machine[], data: Machine): Machine[] => {
  const newList = list.map(m => (m.id === data.id ? data : m));
  saveMachines(newList);
  return newList;
};

export const removeMachine = (list: Machine[], id: string): Machine[] => {
  const newList = list.filter(m => m.id !== id);
  saveMachines(newList);
  return newList;
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
