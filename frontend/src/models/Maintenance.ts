export type MaintenanceStatus = 'Concluida' | 'Em Andamento' | 'Cancelada' | 'Pendente' | string;
export type MaintenanceType = 'Corretiva' | 'Preventiva' | 'Calibracao' | 'Calibração' | string;

export interface Maintenance {
  id: string;
  idMaquina: string;
  machineName: string;
  type: MaintenanceType;
  responsible: string;
  company: string;
  cost: number;                // custo em BRL
  performedDate: string;       // dd/mm/aaaa
  nextDate?: string;           // dd/mm/aaaa
  status: MaintenanceStatus;
  rcOc?: string;
  observacoes?: string;
}
