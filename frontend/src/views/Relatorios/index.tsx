// const Relatorios = () => {
//   return (
//     <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
//       <Sidebar currentPage="relatorios" />
//     </div>
//   );
// };
// export default Relatorios;

import Sidebar from "../../components/Sidebar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
import type { ReportFilters, ReportData, ReportSummary } from "../../models/report";
import { generateReport, exportToExcel, exportToPDF } from "../../controllers/reportController";
import 'primeicons/primeicons.css';

interface ReportTypeCard {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
}

const Relatorios = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dataInicio: '',
    dataFim: '',
    fabricante: '',
    localizacao: '',
  });
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [dateInicio, setDateInicio] = useState<string>('');
  const [dateFim, setDateFim] = useState<string>('');

  const reportTypes: ReportTypeCard[] = [
    { id: 'geral', label: 'Relatório Geral', icon: 'pi pi-file', iconColor: 'text-gray-700' },
    { id: 'por-fabricante', label: 'Por Fabricante', icon: 'pi pi-filter', iconColor: 'text-pink-500' },
    { id: 'historico-manutencao', label: 'Histórico de manutenção', icon: 'pi pi-history', iconColor: 'text-gray-700' },
    { id: 'inativas-descartadas', label: 'Inativas e Descartadas', icon: 'pi pi-exclamation-triangle', iconColor: 'text-red-500' },
    { id: 'maquinas-em-manutencao', label: 'Máquinas em Manutenção', icon: 'pi pi-cog', iconColor: 'text-yellow-500' },
    { id: 'aquisicao-por-periodo', label: 'Aquisição por período', icon: 'pi pi-calendar', iconColor: 'text-green-500' },
    { id: 'manutencoes-proximas', label: 'Manutenções próximas', icon: 'pi pi-clock', iconColor: 'text-blue-500' },
    { id: 'manutencoes-atrasadas', label: 'Manutenções atrasadas', icon: 'pi pi-times-circle', iconColor: 'text-red-600' },
  ];

  const fabricantes = [
    { label: 'Todos', value: '' },
    { label: 'Acme Medical', value: 'Acme Medical' },
    { label: 'HealthTech', value: 'HealthTech' },
    { label: 'CardioCorp', value: 'CardioCorp' },
  ];

  const localizacoes = [
    { label: 'Todos', value: '' },
    { label: 'Bloco A - Sala 101', value: 'Bloco A - Sala 101' },
    { label: 'Bloco B - Sala 202', value: 'Bloco B - Sala 202' },
  ];

  const handleReportSelect = (reportId: string) => {
    setSelectedReport(reportId);
    setShowFilters(true);
    // Gera relatório imediatamente
    const result = generateReport(reportId, filters);
    setReportData(result.data);
    setSummary(result.summary);
  };

  // Converte ISO (yyyy-mm-dd) para dd/mm/yyyy
  const isoToBR = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleFilterChange = () => {
    if (selectedReport) {
      const updatedFilters = {
        ...filters,
        dataInicio: isoToBR(dateInicio),
        dataFim: isoToBR(dateFim),
      };
      const result = generateReport(selectedReport, updatedFilters);
      setReportData(result.data);
      setSummary(result.summary);
    }
  };

  const handleExportExcel = () => {
    exportToExcel(reportData, selectedReport);
  };

  const handleExportPDF = () => {
    exportToPDF(reportData, selectedReport);
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('inativo')) return 'bg-[#D2D1D1] text-gray-800';
    if (s.includes('ativo')) return 'bg-[#8AE67E] text-gray-800';
    if (s.includes('manutenção') || s.includes('manutencao')) return 'bg-[#FFD700] text-gray-800';
    if (s.includes('concluida')) return 'bg-[#8AE67E] text-gray-800';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Sidebar currentPage="relatorios" />
      
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[48px] font-semibold text-black mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Relatórios
              </h1>
              <p className="text-base text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                Gere relatórios detalhados em EXCEL e PDF
              </p>
            </div>
            
            {showFilters && (
              <Button
                label="Ocultar Filtros"
                icon="pi pi-filter-slash"
                className="bg-white text-[#0084FF] border border-[#0084FF] hover:bg-[#0084FF] hover:text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => setShowFilters(false)}
              />
            )}
          </div>

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-medium text-[#373535] mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                Filtros Avançados
              </h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={dateInicio}
                    onChange={(e) => {
                      setDateInicio(e.target.value);
                      setTimeout(handleFilterChange, 100);
                    }}
                    className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] text-gray-700"
                    style={{ fontFamily: 'Poppins, sans-serif', colorScheme: 'light' }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={dateFim}
                    onChange={(e) => {
                      setDateFim(e.target.value);
                      setTimeout(handleFilterChange, 100);
                    }}
                    className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] text-gray-700"
                    style={{ fontFamily: 'Poppins, sans-serif', colorScheme: 'light' }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Fabricante
                  </label>
                  <Dropdown
                    value={filters.fabricante}
                    onChange={(e) => {
                      setFilters({ ...filters, fabricante: e.value });
                      setTimeout(handleFilterChange, 100);
                    }}
                    options={fabricantes}
                    placeholder="Fabricante"
                    className="w-full h-11"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Localização
                  </label>
                  <Dropdown
                    value={filters.localizacao}
                    onChange={(e) => {
                      setFilters({ ...filters, localizacao: e.value });
                      setTimeout(handleFilterChange, 100);
                    }}
                    options={localizacoes}
                    placeholder="Localização"
                    className="w-full h-11"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Seleção do Tipo de Relatório */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-[#373535] mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
              Selecione o tipo de Relatório
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => handleReportSelect(report.id)}
                  className={`p-4 bg-white rounded-lg border-2 transition-all text-left hover:shadow-md ${
                    selectedReport === report.id
                      ? 'border-[#0084FF] bg-[#0084FF]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${report.icon} text-2xl ${report.iconColor}`}></i>
                    <span className="text-[15px] text-[#373535] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {report.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview do Relatório */}
          {reportData.length > 0 && summary && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-medium text-[#373535] mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                Preview do Relatório
              </h3>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-red-100 rounded-lg p-4">
                  <div className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {summary.total}
                  </div>
                  <div className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Total
                  </div>
                </div>

                <div className="bg-yellow-100 rounded-lg p-4">
                  <div className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {summary.ativos}
                  </div>
                  <div className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Ativos
                  </div>
                </div>

                <div className="bg-blue-100 rounded-lg p-4">
                  <div className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {summary.manutencao}
                  </div>
                  <div className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Manutenção
                  </div>
                </div>

                <div className="bg-green-100 rounded-lg p-4">
                  <div className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {summary.descartados}
                  </div>
                  <div className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Descartados
                  </div>
                </div>
              </div>

              {/* Tabela de Preview */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Patrimônio
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Função
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Data de Aquisição
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.slice(0, 5).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.patrimonio}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.funcao}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.dataAquisicao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reportData.length > 5 && (
                <p className="text-sm text-gray-500 mt-2 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Mostrando 5 de {reportData.length} registros
                </p>
              )}
            </div>
          )}

          {/* Exportar Relatório */}
          {reportData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-[#373535] mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                Exportar Relatório
              </h3>
              
              <div className="flex gap-4">
                <Button
                  label="Exportar Excel"
                  icon="pi pi-file-excel"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                  onClick={handleExportExcel}
                />
                
                <Button
                  label="Exportar PDF"
                  icon="pi pi-file-pdf"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                  onClick={handleExportPDF}
                />
              </div>

              <p className="text-sm text-gray-500 mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                O relatório será baixado automaticamente após a geração.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;