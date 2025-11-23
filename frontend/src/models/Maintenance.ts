export type MaintenanceStatus = 'Concluida' | 'Em Andamento' | 'Cancelada' | 'Pendente' | string;
export type MaintenanceType = 'Corretiva' | 'Preventiva' | 'Calibracao' | 'Calibração' | string;

export interface Maintenance {
  id: string;
  idMaquina: string;
  machineName?: string;
  tipoManutencao: MaintenanceType;
  responsavel: string;
  empresaResponsavel: string;
  valor: number;
  dataManutencao: string;
  dataProxima?: string;
  status: MaintenanceStatus;
  rcOc?: string;
  observacao?: string;
}
