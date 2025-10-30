import type { ReportData, ReportFilters, ReportSummary } from '../models/report';
import { loadMachines } from './machinesController';
import { loadMaintenances } from './maintenancesController';

export const generateReport = (
  type: string,
  filters: ReportFilters
): { data: ReportData[]; summary: ReportSummary } => {
  const machines = loadMachines();
  const maintenances = loadMaintenances();

  let filteredData: ReportData[] = [];
  
  // Aplica filtros baseados no tipo de relatório
  switch (type) {
    case 'geral':
      filteredData = machines.map(m => ({
        name: m.name,
        patrimonio: m.patrimony,
        funcao: m.funcao,
        status: m.status,
        dataAquisicao: m.acquisitionDate,
      }));
      break;
      
    case 'por-fabricante':
      filteredData = machines
        .filter(m => !filters.fabricante || m.fabricante === filters.fabricante)
        .map(m => ({
          name: m.name,
          patrimonio: m.patrimony,
          funcao: m.funcao,
          status: m.status,
          dataAquisicao: m.acquisitionDate,
        }));
      break;
      
    case 'historico-manutencao':
      // Combina dados de máquinas e manutenções
      filteredData = maintenances.map(maint => {
        const machine = machines.find(m => m.name === maint.machineName);
        return {
          name: maint.machineName,
          patrimonio: machine?.patrimony || 'N/A',
          funcao: machine?.funcao || 'N/A',
          status: maint.status,
          dataAquisicao: maint.performedDate,
        };
      });
      break;
      
    case 'inativas-descartadas':
      filteredData = machines
        .filter(m => m.status === 'Inativo')
        .map(m => ({
          name: m.name,
          patrimonio: m.patrimony,
          funcao: m.funcao,
          status: m.status,
          dataAquisicao: m.acquisitionDate,
        }));
      break;
      
    case 'maquinas-em-manutencao':
      filteredData = machines
        .filter(m => m.status === 'Manutenção')
        .map(m => ({
          name: m.name,
          patrimonio: m.patrimony,
          funcao: m.funcao,
          status: m.status,
          dataAquisicao: m.acquisitionDate,
        }));
      break;
      
    default:
      filteredData = [];
  }
  
  // Aplica filtros de data e localização
  if (filters.dataInicio || filters.dataFim || filters.localizacao) {
    filteredData = filteredData.filter(item => {
      // Lógica de filtragem por data e localização
      return true; // Simplificado para exemplo
    });
  }
  
  // Calcula resumo
  const summary: ReportSummary = {
    total: filteredData.length,
    ativos: filteredData.filter(d => d.status === 'Ativo').length,
    manutencao: filteredData.filter(d => d.status.includes('manutenção')).length,
    descartados: filteredData.filter(d => d.status === 'Inativo').length,
  };
  
  return { data: filteredData, summary };
};

export const exportToExcel = (data: ReportData[], reportType: string) => {
  console.log(`Exportando ${data.length} registros para Excel - ${reportType}`);
  // Implementação futura com biblioteca como xlsx
};

export const exportToPDF = (data: ReportData[], reportType: string) => {
  console.log(`Exportando ${data.length} registros para PDF - ${reportType}`);
  // Implementação futura com biblioteca como jsPDF
};