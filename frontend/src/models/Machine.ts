export interface Machine {
  id: string;
  nome: string;
  patrimony: string;
  status: 'Ativo' | 'Manutenção' | 'Descartado' | 'Inativo' | string;
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
  justificativaInativo?: string; // justificativa quando status for Inativo
}
