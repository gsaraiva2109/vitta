export type ReportType = 
  | 'geral'
  | 'por-fabricante'
  | 'historico-manutencao'
  | 'inativas-descartadas'
  | 'maquinas-em-manutencao'
  | 'aquisicao-por-periodo'
  | 'manutencoes-proximas'
  | 'manutencoes-atrasadas';

export interface ReportFilters {
  dataInicio?: string;
  dataFim?: string;
  fabricante?: string;
  localizacao?: string;
}

export interface ReportData {
  name: string;
  patrimonio: string;
  funcao: string;
  status: string;
  dataAquisicao: string;
}

export interface ReportSummary {
  total: number;
  ativos: number;
  manutencao: number;
  descartados: number;
}