import Sidebar from '../../components/Sidebar';
import { useEffect, useMemo, useState } from 'react';
import type { Machine } from '../../models/Machine';
import type { Maintenance } from '../../models/Maintenance';
import { loadMachinesFromAPI } from '../../controllers/machinesApiController';
import { loadMaintenancesFromAPI } from '../../controllers/maintenancesApiController';
import { getAlerts } from '../../services/alertaService';
import { parse, isAfter, subDays, isWithinInterval, startOfDay, format, isValid, compareDesc, compareAsc } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Helpers (reaproveitando padrões)
const normalizeStatus = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('manuten') || s.includes('manutenção')) return 'manutencao';
  if (s.includes('inativ')) return 'inativo';
  if (s.includes('ativ') && !s.includes('inativ')) return 'ativo';
  if (s.includes('descart')) return 'descartado';
  return 'outro';
};

const badgeForStatus = (status: string) => {
  const s = status?.toLowerCase();
  if (s.includes('conclu') || s.includes('ativo')) return 'bg-[#8AE67E] text-gray-800';
  if (s.includes('manuten') || s.includes('andamento')) return 'bg-[#DBD83B] text-gray-800';
  if (s.includes('descartado') || s.includes('cancel')) return 'bg-[#D95555] text-gray-800';
  return 'bg-gray-100 text-gray-700';
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center justify-center h-6 px-3 rounded-full mt-0 text-xs font-medium ${badgeForStatus(status)} shadow-[0_6px_18px_rgba(0,0,0,0.08)]`}
    title={status}
    style={{ fontFamily: 'Poppins, sans-serif' }}
  >
    {status}
  </span>
);

const Home = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [alertsCount, setAlertsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [machinesData, maintenancesData, alertsData] = await Promise.all([
              loadMachinesFromAPI(),
              loadMaintenancesFromAPI(),
              getAlerts()
            ]);
            setMachines(machinesData);
            setMaintenances(maintenancesData);
            setAlertsCount(alertsData.length);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const metrics = useMemo(() => {
    const total = machines.length;
    const ativo = machines.filter(m => normalizeStatus(m.status) === 'ativo').length;
    const manutencao = machines.filter(m => normalizeStatus(m.status) === 'manutencao').length;
    // const descartado = machines.filter(m => normalizeStatus(m.status) === 'descartado').length;
    return { total, ativo, manutencao, alertas: alertsCount };
  }, [machines, alertsCount]);

  // Processamento para "Últimas Manutenções" (Histórico Geral)
  const recentMaintenances = useMemo(() => {
    // Copiar e ordenar por data de manutenção decrescente
    return [...maintenances]
      .filter(m => m.dataManutencao && m.status?.toLowerCase().includes('conclu')) // Somente manutenções concluídas
      .sort((a, b) => {
        const dateA = parse(a.dataManutencao, 'dd/MM/yyyy', new Date());
        const dateB = parse(b.dataManutencao, 'dd/MM/yyyy', new Date());
        if (!isValid(dateA) || !isValid(dateB)) return 0;
        return compareDesc(dateA, dateB);
      })
      .slice(0, 6);
  }, [maintenances]);

  // Processamento para o Gráfico (Últimos 30 dias)
  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const thirtyDaysAgo = subDays(today, 30);
    
    const dataMap = new Map<string, number>();
    
    // Inicializar os últimos 30 dias com 0
    for (let i = 0; i <= 30; i++) {
      const d = subDays(today, 30 - i);
      dataMap.set(format(d, 'dd/MM'), 0);
    }

    maintenances.forEach(m => {
      if (!m.dataManutencao) return;
      const date = parse(m.dataManutencao, 'dd/MM/yyyy', new Date());
      if (isValid(date) && isWithinInterval(date, { start: thirtyDaysAgo, end: today })) {
        const key = format(date, 'dd/MM');
        dataMap.set(key, (dataMap.get(key) || 0) + 1);
      }
    });

    return Array.from(dataMap.entries()).map(([name, count]) => ({ name, count }));
  }, [maintenances]);

  // Processamento para "Próximas Manutenções" (Previsões)
  const upcomingMaintenances = useMemo(() => {
    const today = startOfDay(new Date());
    
    return [...maintenances]
      .filter(m => m.dataProxima && m.status === 'Pendente') // Somente manutenções pendentes com data próxima
      .sort((a, b) => {
        const dateA = parse(a.dataProxima!, 'dd/MM/yyyy', new Date());
        const dateB = parse(b.dataProxima!, 'dd/MM/yyyy', new Date());
        if (!isValid(dateA) || !isValid(dateB)) return 0;
        return compareAsc(dateA, dateB);
      })
      .filter(m => {
         const date = parse(m.dataProxima!, 'dd/MM/yyyy', new Date());
         return isValid(date) && (isAfter(date, today) || date.getTime() === today.getTime());
      })
      .slice(0, 4);
  }, [maintenances]);

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Sidebar currentPage="home" />

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Carregando...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : (
          <div className="p-8 h-full flex flex-col gap-6">
            <div>
              <h1 className="text-[48px] font-semibold text-black mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Home
              </h1>
              <p className="text-base text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                Visão geral do sistema
              </p>
            </div>

            {/* FULL WIDTH STATUS CARDS (métricas dinâmicas) */}
            <div className="w-full">
              <div className="flex gap-3">
                {/* Máquinas Ativas - Verde */}
                <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="bg-[#31BA27] rounded-lg p-2.5 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[18px] text-[#31BA27] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Máquinas Ativas
                    </div>
                    <div className="text-xl text-[#31BA27] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      {metrics.ativo}
                    </div>
                  </div>
                </div>

                {/* Em Manutenção - Amarelo */}
                <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="bg-[#E6E320] rounded-lg p-2.5 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[18px] text-[#E6E320] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Em Manutenção
                    </div>
                    <div className="text-xl text-[#E6E320] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      {metrics.manutencao}
                    </div>
                  </div>
                </div>

                {/* Alertas - Vermelho */}
                <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="bg-[#F21515] rounded-lg p-2.5 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[18px] text-[#F21515] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Alertas
                    </div>
                    <div className="text-xl text-[#F21515] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      {metrics.alertas}
                    </div>
                  </div>
                </div>

                {/* Total de Máquinas - Azul */}
                <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="bg-[#0084FF] rounded-lg p-2.5 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] text-[#0084FF] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Total de Máquinas
                    </div>
                    <div className="text-xl text-[#0084FF] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      {metrics.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRID COM O RESTANTE DO CONTEÚDO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
              {/* Coluna direita: Gráfico e Últimas Manutenções */}
              <div className="flex flex-col gap-4 overflow-hidden">
                
                {/* Gráfico de Manutenções (30 dias) */}
                <div className="bg-white rounded-[10px] p-6 h-[280px] flex flex-col">
                  <div className="flex items-center gap-[7px] mb-4">
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.07868 5.06891C8.87402 1.27893 15.0437 1.31923 18.8622 5.13778C22.6824 8.95797 22.7211 15.1313 18.9262 18.9262C15.1312 22.7211 8.95793 22.6824 5.13774 18.8622C2.87389 16.5984 1.93904 13.5099 2.34047 10.5812C2.39672 10.1708 2.775 9.88377 3.18537 9.94002C3.59575 9.99627 3.88282 10.3745 3.82658 10.7849C3.4866 13.2652 4.27782 15.881 6.1984 17.8016C9.44288 21.0461 14.6664 21.0646 17.8655 17.8655C21.0646 14.6664 21.046 9.44292 17.8015 6.19844C14.5587 2.95561 9.33889 2.93539 6.13935 6.12957L6.88705 6.13333C7.30126 6.13541 7.63535 6.47288 7.63327 6.88709C7.63119 7.3013 7.29372 7.63539 6.87951 7.63331L4.33396 7.62052C3.92269 7.61845 3.58981 7.28556 3.58774 6.8743L3.57495 4.32874C3.57286 3.91454 3.90696 3.57707 4.32117 3.57498C4.73538 3.5729 5.07285 3.907 5.07493 4.32121L5.07868 5.06891ZM11.9999 7.24992C12.4141 7.24992 12.7499 7.58571 12.7499 7.99992V11.6893L15.0302 13.9696C15.3231 14.2625 15.3231 14.7374 15.0302 15.0302C14.7373 15.3231 14.2624 15.3231 13.9696 15.0302L11.2499 12.3106V7.99992C11.2499 7.58571 11.5857 7.24992 11.9999 7.24992Z" fill="#373535"></path> </g></svg>
                    <h2 className="text-[#373535] text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Histórico (30 Dias)
                    </h2>
                  </div>
                  <div className="flex-1 w-full min-h-0">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                           <XAxis 
                              dataKey="name" 
                              tick={{fontSize: 10, fill: '#666'}} 
                              interval={4} // Show every 4th day to avoid clutter
                              axisLine={false}
                              tickLine={false}
                           />
                           <YAxis 
                              tick={{fontSize: 10, fill: '#666'}} 
                              axisLine={false}
                              tickLine={false}
                              allowDecimals={false}
                           />
                           <Tooltip 
                              cursor={{fill: 'transparent'}}
                              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                           />
                           <Bar dataKey="count" fill="#31BA27" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
                </div>

                {/* Lista de Últimas Manutenções */}
                <div className="bg-white rounded-[10px] p-6 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-[7px] mb-[21px]">
                    <svg className="w-7 h-[27px] text-[#373535]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    <h2 className="text-[#373535] text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Últimas Manutenções
                    </h2>
                  </div>
                  <div className="space-y-2 overflow-y-auto flex-1">
                    {recentMaintenances.length === 0 ? (
                      <div className="text-sm text-gray-500">Nenhum registro.</div>
                    ) : recentMaintenances.map((m) => (
                      <div key={m.id} className="bg-[#D9D9D970] rounded-lg p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-black text-[14px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                            {m.machineName || `Máquina ${m.idMaquina}`}
                          </span>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="text-[#595454] text-[12px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                          {m.tipoManutencao} - {m.dataManutencao}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna esquerda: Próximas Manutenções */}
              <div className="flex flex-col h-full">
                <div className="bg-white rounded-[10px] p-6 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-[7px] mb-[15px]">
                    <svg className="w-7 h-[27px] text-[#373535]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                    <h2 className="text-[#373535] text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                      Próximas Manutenções
                    </h2>
                  </div>
                  <div className="space-y-2 overflow-y-auto flex-1">
                    {upcomingMaintenances.length === 0 ? (
                      <div className="text-sm text-gray-500">Nenhuma previsão próxima.</div>
                    ) : upcomingMaintenances.map((m) => (
                      <div key={m.id} className="bg-[#D9D9D970] rounded-lg p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-black text-[14px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                            {m.machineName || `Máquina ${m.idMaquina}`}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                             {m.dataProxima}
                          </span>
                        </div>
                        <p className="text-[#595454] text-[11px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                          {m.tipoManutencao}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Home;