import type { ReportData, ReportFilters, ReportSummary } from '../models/report';
import { loadMachines } from './machinesController';
import { loadMaintenances } from './maintenancesController';

// Converte dd/mm/yyyy para objeto Date
const parseBRDate = (br: string): Date | null => {
  if (!br) return null;
  const [d, m, y] = br.split('/');
  if (!d || !m || !y) return null;
  return new Date(+y, +m - 1, +d);
};

// Verifica se uma data está dentro do intervalo (inclusivo)
const isDateInRange = (dateStr: string, startStr: string, endStr: string): boolean => {
  const date = parseBRDate(dateStr);
  if (!date) return false;

  const start = parseBRDate(startStr);
  const end = parseBRDate(endStr);

  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

export const generateReport = (
  type: string,
  filters: ReportFilters
): { data: ReportData[]; summary: ReportSummary } => {
  const machines = loadMachines([]);
  const maintenances = loadMaintenances([]);

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
        localizacao: m.location,
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
          localizacao: m.location,
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
          localizacao: machine?.location || 'N/A',
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
          localizacao: m.location,
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
          localizacao: m.location,
        }));
      break;
      
    default:
      filteredData = [];
  }
  
  // Aplica filtros de data e localização
  if (filters.dataInicio || filters.dataFim || filters.localizacao) {
    filteredData = filteredData.filter(item => {
      // Filtro por data de aquisição
      if (filters.dataInicio || filters.dataFim) {
        if (!isDateInRange(item.dataAquisicao, filters.dataInicio, filters.dataFim)) {
          return false;
        }
      }

      // Filtro por localização
      if (filters.localizacao && item.localizacao !== filters.localizacao) {
        return false;
      }

      return true;
    });
  }
  
  // Calcula resumo
  const summary: ReportSummary = {
    total: filteredData.length,
    ativos: filteredData.filter(d => d.status === 'Ativo').length,
    manutencao: filteredData.filter(d => d.status.includes('manutenção') || d.status.includes('Manutenção')).length,
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