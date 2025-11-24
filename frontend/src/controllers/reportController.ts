import type {
  ReportData,
  ReportFilters,
  ReportSummary,
} from "../models/report";
import { loadMachinesFromAPI } from "./machinesApiController";
import { loadMaintenancesFromAPI } from "./maintenancesApiController";
import type { Machine } from "../models/Machine";
import type { Maintenance } from "../models/Maintenance";

// ------------------------------
// 1. Funções auxiliares
// ------------------------------

const parseBRDate = (br: string): Date | null => {
  if (!br) return null;
  const [d, m, y] = br.split("/");
  if (!d || !m || !y) return null;
  return new Date(+y, +m - 1, +d);
};

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

// ------------------------------
// 2. Geração dos dados do relatório
// ------------------------------

export const generateReport = async (
  type: string,
  filters: ReportFilters
): Promise<{ data: ReportData[]; summary: ReportSummary }> => {
  const machines = await loadMachinesFromAPI();
  const maintenances = await loadMaintenancesFromAPI();

  let filteredData: ReportData[] = [];

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

  // Filtros adicionais
  if (filters.dataInicio || filters.dataFim || filters.localizacao) {
    filteredData = filteredData.filter((item) => {
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
      if (filters.localizacao && item.localizacao !== filters.localizacao) {
        return false;
      }
      return true;
    });
  }

  const summary: ReportSummary = {
    total: filteredData.length,
    ativos: filteredData.filter((d) => d.status === "Ativo").length,
    manutencao: filteredData.filter((d) => d.status.includes("Manutenção"))
      .length,
    descartados: filteredData.filter((d) => d.status === "Inativo").length,
  };

  return { data: filteredData, summary };
};

// ------------------------------
// 3. EXPORTAR PARA EXCEL
// ------------------------------

export const exportToExcel = (data: ReportData[], reportType: string) => {
  console.log("Gerando Excel...");

  import("xlsx").then((XLSX) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    const fileName = `relatorio_${reportType}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  });
};

// ------------------------------
// 4. EXPORTAR PARA PDF
// ------------------------------

export const exportToPDF = (data: ReportData[], reportType: string) => {
  console.log("Gerando PDF...");

  import("jspdf").then(({ default: jsPDF }) => {
    import("jspdf-autotable").then(() => {
      const doc = new jsPDF();

      doc.text(`Relatório - ${reportType}`, 14, 10);

      const columns = Object.keys(data[0] || {});
      const rows = data.map((d) => Object.values(d));

      (doc as any).autoTable({
        head: [columns],
        body: rows,
      });

      const fileName = `relatorio_${reportType}.pdf`;
      doc.save(fileName);
    });
  });
};
