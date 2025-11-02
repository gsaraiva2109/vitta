import Sidebar from '../../components/Sidebar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useEffect, useMemo, useState } from 'react';
import type { Alert } from '../../models/Alert';
import { generateAlerts } from '../../controllers/alertsController';
import { loadMachines } from '../../controllers/machinesController';

const badgeForUrgency = (urgency: string) => {
  const u = urgency.toLowerCase();
  if (u.includes('vencid')) return 'bg-[#F21515A8] text-white';
  if (u.includes('urgent')) return 'bg-[#E6E320] text-gray-800';
  if (u.includes('próxim') || u.includes('proxim')) return 'bg-[#0084FFD4] text-white';
  return 'bg-gray-100 text-gray-700';
};

const UrgencyBadge = ({ urgency }: { urgency: string }) => (
  <span
    className={`inline-flex items-center justify-center w-28 h-6 px-3 rounded-full text-xs font-medium ${badgeForUrgency(urgency)} shadow-[0_6px_18px_rgba(0,0,0,0.08)]`}
    title={urgency}
    style={{ fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}
  >
    {urgency}
  </span>
);

const Alertas = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [search, setSearch] = useState<string>('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('');

  useEffect(() => {
    const machines = loadMachines([]);
    setAlerts(generateAlerts(machines));
  }, []);

  const urgencyOptions = [
    { label: 'Todas as urgências', value: '' },
    { label: 'Vencidas', value: 'vencida' },
    { label: 'Urgentes', value: 'urgente' },
    { label: 'Próximas', value: 'proxima' },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alerts.filter(a => {
      // filtro de urgência
      if (urgencyFilter && !a.urgency.toLowerCase().includes(urgencyFilter)) return false;
      // filtro de busca
      if (!q) return true;
      return (
        a.machineName.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    });
  }, [alerts, urgencyFilter, search]);

  const metrics = useMemo(() => {
    const total = alerts.length;
    const vencidas = alerts.filter(a => a.urgency === 'Vencida').length;
    const urgentes = alerts.filter(a => a.urgency === 'Urgente').length;
    const proximas = alerts.filter(a => a.urgency === 'Próxima').length;
    return { total, vencidas, urgentes, proximas };
  }, [alerts]);

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Sidebar currentPage="alertas" />
      <div className="flex-1 h-full overflow-y-auto">
        <div className="p-8 h-full flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-[48px] font-semibold text-black mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              Alertas
            </h1>
            <p className="text-base text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
              Monitores as próximas manutenções
            </p>
          </div>

          {/* Cards de métricas */}
          <div className="w-full">
            <div className="flex gap-3">
              {/* Vencidas */}
              <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="bg-[#F21515] rounded-lg p-2.5 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[18px] text-[#F21515] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Vencidas
                  </div>
                  <div className="text-xl text-[#F21515] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {metrics.vencidas}
                  </div>
                </div>
              </div>

              {/* Urgentes (7 dias) */}
              <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="bg-[#E6E320] rounded-lg p-2.5 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[18px] text-[#E6E320] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Urgentes (7 dias)
                  </div>
                  <div className="text-xl text-[#E6E320] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {metrics.urgentes}
                  </div>
                </div>
              </div>

              {/* Próximas (30 dias) */}
              <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="bg-[#0084FF] rounded-lg p-2.5 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[18px] text-[#0084FF] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Próximas (30 dias)
                  </div>
                  <div className="text-xl text-[#0084FF] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {metrics.proximas}
                  </div>
                </div>
              </div>

              {/* Total de Alertas */}
              <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="bg-[#31BA27] rounded-lg p-2.5 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] text-[#31BA27] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Total de Alertas
                  </div>
                  <div className="text-xl text-[#31BA27] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {metrics.total}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtro */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
              {/* Barra de busca */}
              <div className="flex-1 relative">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-400 z-10">
                  <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                </svg>
                <InputText
                  placeholder="Buscar por máquina ou tipo"
                  value={search}
                  onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
                  className="w-full h-[52px] pl-12 pr-4 text-base rounded-xl border border-gray-200 shadow-sm"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '15px' }}
                />
              </div>

              {/* Dropdown de urgência */}
              <div className="w-full sm:w-[280px] relative">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-400 z-10">
                  <path d="M2.75 3h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5ZM5 7.75A.75.75 0 0 1 5.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 7.75ZM7.75 11.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM10 15.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z" />
                </svg>
                <Dropdown
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.value)}
                  options={urgencyOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todas as urgências"
                  className="w-full h-[52px] pl-12 rounded-xl border border-gray-200 shadow-sm"
                  panelClassName="rounded-xl"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
                />
              </div>
            </div>
          </div>

          {/* Lista de alertas */}
          <div className="flex-1 overflow-hidden bg-white rounded-[10px] p-6">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="w-24 h-24 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                <div className="text-gray-500 text-base font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Nenhum alerta encontrado!
                </div>
                <div className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Todas as manutenções estão em dia
                </div>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto h-full">
                {filtered.map((a) => (
                  <div key={a.id} className="bg-[#D9D9D970] rounded-lg p-4 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-black text-[15px] font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {a.machineName}
                        </span>
                      </div>
                      <p className="text-[#595454] text-[13px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                        {a.type} - {a.dueDate}
                        {a.daysOverdue !== undefined && ` (${a.daysOverdue} dia${a.daysOverdue > 1 ? 's' : ''} de atraso)`}
                        {a.daysRemaining !== undefined && ` (${a.daysRemaining} dia${a.daysRemaining > 1 ? 's' : ''} restante${a.daysRemaining > 1 ? 's' : ''})`}
                      </p>
                    </div>
                    <UrgencyBadge urgency={a.urgency} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alertas;
