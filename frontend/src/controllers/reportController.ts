import type {
  ReportData,
  ReportFilters,
  ReportSummary,
} from "../models/report";
import { loadMachinesFromAPI } from "./machinesApiController";
import { loadMaintenancesFromAPI } from "./maintenancesApiController";
import type { Machine } from "../models/Machine";
import type { Maintenance } from "../models/Maintenance";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Converte dd/mm/yyyy para objeto Date
const parseBRDate = (br: string): Date | null => {
  if (!br) return null;
  const [d, m, y] = br.split("/");
  if (!d || !m || !y) return null;
  return new Date(+y, +m - 1, +d);
};

// Verifica se uma data está dentro do intervalo (inclusivo)
const isDateInRange = (
  dateStr: string,
  startStr: string,
  endStr: string
): boolean => {
  const date = parseBRDate(dateStr);
  if (!date) return false;

  const start = parseBRDate(startStr);
  const end = parseBRDate(endStr);

  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

export const generateReport = async (
  type: string,
  filters: ReportFilters
): Promise<{ data: ReportData[]; summary: ReportSummary }> => {
  const machines = await loadMachinesFromAPI();
  const maintenances = await loadMaintenancesFromAPI();

  let filteredData: ReportData[] = [];

  // Aplica filtros baseados no tipo de relatório
  switch (type) {
    case "geral":
      filteredData = machines.map((m: Machine) => ({
        nome: m.nome,
        patrimonio: m.patrimony,
        funcao: m.funcao,
        status: m.status,
        dataAquisicao: m.acquisitionDate,
        localizacao: m.location,
      }));
      break;

    case "por-fabricante":
      filteredData = machines
        .filter(
          (m: Machine) =>
            !filters.fabricante || m.fabricante === filters.fabricante
        )
        .map((m: Machine) => ({
          nome: m.nome,
          patrimonio: m.patrimony,
          funcao: m.funcao,
          status: m.status,
          dataAquisicao: m.acquisitionDate,
          localizacao: m.location,
        }));
      break;

    case "historico-manutencao":
      // Combina dados de máquinas e manutenções
      filteredData = maintenances.map((maint: Maintenance) => {
        const machine = machines.find((m: Machine) => m.id === maint.idMaquina);
        return {
          nome: maint.machineName || "N/A",
          patrimonio: machine?.patrimony || "N/A",
          funcao: machine?.funcao || "N/A",
          status: maint.status,
          dataAquisicao: maint.dataManutencao,
          localizacao: machine?.location || "N/A",
        };
      });
      break;

    case "inativas-descartadas":
      filteredData = machines
        .filter((m: Machine) => m.status === "Inativo")
        .map((m: Machine) => ({
          nome: m.nome,
          patrimonio: m.patrimony,
          funcao: m.funcao,
          status: m.status,
          dataAquisicao: m.acquisitionDate,
          localizacao: m.location,
        }));
      break;

    case "maquinas-em-manutencao":
      filteredData = machines
        .filter((m: Machine) => m.status === "Manutenção")
        .map((m: Machine) => ({
          nome: m.nome,
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
    filteredData = filteredData.filter((item) => {
      // Filtro por data de aquisição
      if (filters.dataInicio || filters.dataFim) {
        if (
          !isDateInRange(
            item.dataAquisicao,
            filters.dataInicio,
            filters.dataFim
          )
        ) {
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
    ativos: filteredData.filter((d) => d.status === "Ativo").length,
    manutencao: filteredData.filter(
      (d) => d.status.includes("manutenção") || d.status.includes("Manutenção")
    ).length,
    descartados: filteredData.filter((d) => d.status === "Inativo").length,
  };

  return { data: filteredData, summary };
};

export const exportToExcel = async (data: ReportData[], reportType: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Relatório");

  if (data.length > 0) {
    // Cabeçalho
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Dados
    data.forEach((item) => {
      const row = headers.map(header => item[header as keyof ReportData]);
      worksheet.addRow(row);
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const file = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `relatorio-${reportType}.xlsx`);
};

export const exportToPDF = (data: ReportData[], reportType: string) => {
  const doc = new jsPDF();

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  // Convert objects to arrays of values
  const rows = data.map(item => Object.values(item));

  doc.text(`Relatório - ${reportType}`, 14, 15);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
  });

  doc.save(`relatorio-${reportType}.pdf`);
};