export interface Machine {
  id: string;
  name: string;
  patrimony: string;
  status: 'Ativo' | 'Manutenção' | 'Pendente' | 'Inativo' | string;
  funcao: string;
  fabricante: string;
  acquisitionDate: string; // formato BR: dd/mm/aaaa
  location: string;
  maintenanceInterval?: string;
  calibrationInterval?: string;
  serialNumber?: string;
  modelo?: string;
  rcOc?: string;
  observacoes?: string;
}
