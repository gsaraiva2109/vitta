import type { Maintenance } from '../models/Maintenance';

const STORAGE_KEY = 'maintenances';

export const loadMaintenances = (seed: Maintenance[] = []): Maintenance[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Maintenance[];
      return parsed.map(m => ({ rcOc: '', observacoes: '', ...m }));
    }
    const normalizedSeed = seed.map(m => ({ rcOc: '', observacoes: '', ...m }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedSeed));
    return normalizedSeed;
  } catch {
    return seed.map(m => ({ rcOc: '', observacoes: '', ...m }));
  }
};

export const saveMaintenances = (list: Maintenance[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const nextId = (list: Maintenance[]) => `MT-${String(list.length + 1).padStart(3, '0')}`;

export const addMaintenance = (list: Maintenance[], data: Omit<Maintenance, 'id'>) => {
  const m: Maintenance = { id: nextId(list), ...data };
  const newList = [...list, m];
  saveMaintenances(newList);
  return newList;
};

export const updateMaintenance = (list: Maintenance[], data: Maintenance) => {
  const newList = list.map(m => (m.id === data.id ? { ...m, ...data } : m));
  saveMaintenances(newList);
  return newList;
};

export const removeMaintenance = (list: Maintenance[], id: string) => {
  const newList = list.filter(m => m.id !== id);
  saveMaintenances(newList);
  return newList;
};
