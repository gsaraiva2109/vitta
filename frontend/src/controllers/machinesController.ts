import type { Machine } from '../models/Machine';

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const processMachineFromAPI = (apiMachine: any): Machine => {
  const machine: Machine = {
    id: apiMachine.idMaquina,
    name: apiMachine.nome,
    patrimony: apiMachine.patrimonio,
    status: apiMachine.status,
    funcao: apiMachine.funcao,
    fabricante: apiMachine.fabricante,
    acquisitionDate: apiMachine.dataAquisicao ? isoToBR(apiMachine.dataAquisicao.split('T')[0]) : '',
    location: apiMachine.localizacao,
    maintenanceInterval: apiMachine.intervaloManutencao,
    calibrationInterval: apiMachine.intervaloCalibracao,
    serialNumber: apiMachine.numeroSerie,
    modelo: apiMachine.modelo,
    rcOc: apiMachine.rcOc,
    observacoes: apiMachine.observacao,
    justificativaInativo: apiMachine.justificativa,
  };
  return machine;
};

const prepareMachineForAPI = (frontendMachine: Partial<Machine>): any => {
  const apiMachine: any = {
    nome: frontendMachine.name,
    patrimonio: frontendMachine.patrimony,
    status: frontendMachine.status?.toLowerCase(),
    funcao: frontendMachine.funcao,
    fabricante: frontendMachine.fabricante,
    dataAquisicao: frontendMachine.acquisitionDate ? brToISO(frontendMachine.acquisitionDate) : null,
    localizacao: frontendMachine.location,
    intervaloManutencao: frontendMachine.maintenanceInterval,
    intervaloCalibracao: frontendMachine.calibrationInterval,
    numeroSerie: frontendMachine.serialNumber,
    modelo: frontendMachine.modelo,
    rcOc: frontendMachine.rcOc,
    observacao: frontendMachine.observacoes,
    justificativa: frontendMachine.justificativaInativo,
  };

  if (frontendMachine.id) {
    apiMachine.idMaquina = frontendMachine.id;
  }

  return apiMachine;
};

export const loadMachines = async (): Promise<Machine[]> => {
  try {
    const response = await fetch(`${API_URL}/maquinas`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(processMachineFromAPI);
  } catch (error) {
    console.error('Error loading machines:', error);
    return [];
  }
};

export const addMachine = async (data: Omit<Machine, 'id'>): Promise<Machine | null> => {
  try {
    const response = await fetch(`${API_URL}/maquinas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepareMachineForAPI(data)),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const newMachine = await response.json();
    return processMachineFromAPI(newMachine);
  } catch (error) {
    console.error('Error adding machine:', error);
    return null;
  }
};

export const updateMachine = async (data: Machine): Promise<Machine | null> => {
  try {
    const response = await fetch(`${API_URL}/maquinas/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepareMachineForAPI(data)),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const updatedMachine = await response.json();
    return processMachineFromAPI(updatedMachine);
  } catch (error) {
    console.error('Error updating machine:', error);
    return null;
  }
};

export const removeMachine = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/maquinas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Error removing machine:', error);
    return false;
  }
};
