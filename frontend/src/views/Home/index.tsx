import Sidebar from '../../components/Sidebar';
import { useEffect, useMemo, useState } from 'react';
import type { Machine } from '../../models/Machine';
import { authenticatedFetch } from '../../services/apiService';

// Helpers (reaproveitando padrões da página Máquinas)
const normalizeStatus = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('manuten') || s.includes('manutenção')) return 'manutencao';
  if (s.includes('inativ')) return 'inativo';
  if (s.includes('ativ') && !s.includes('inativ')) return 'ativo';
  if (s.includes('pend')) return 'pendente';
  return 'outro';
};
const badgeForStatus = (status: string) => {
  const s = status?.toLowerCase();
  if (s.includes('manutenção') || s.includes('manutenc')) return 'bg-[#DBD83B] text-gray-800';
  if (s.includes('inativo')) return 'bg-[#D2D1D1] text-gray-800';
  if (s.includes('ativo')) return 'bg-[#8AE67E] text-gray-800';
  if (s.includes('pendente')) return 'bg-[#D95555] text-gray-800';
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

  useEffect(() => {
    // Carrega máquinas do backend
    const fetchMachines = async () => {
      try {
        const data = await authenticatedFetch<Machine[]>('/maquinas');
        setMachines(data || []);
      } catch (err) {
        console.error('Erro ao carregar máquinas:', err);
        setMachines([]);
      }
    };
    fetchMachines();
  }, []);

  const metrics = useMemo(() => {
    const total = machines.length;
    const ativo = machines.filter(m => normalizeStatus(m.status) === 'ativo').length;
    const manutencao = machines.filter(m => normalizeStatus(m.status) === 'manutencao').length;
    const pendente = machines.filter(m => normalizeStatus(m.status) === 'pendente').length;
    return { total, ativo, manutencao, pendente };
  }, [machines]);

  // Listas derivadas: últimas manutenções (status: Manutenção), previsões (status: Pendente)
  const manutencoes = useMemo(
    () => machines.filter(m => normalizeStatus(m.status) === 'manutencao').slice(0, 6),
    [machines]
  );
  const previsoes = useMemo(
    () => machines.filter(m => normalizeStatus(m.status) === 'pendente').slice(0, 6),
    [machines]
  );

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Sidebar currentPage="home" />

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto">
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
                <div className="bg-[#31BA27] rounded-lg p-2.5 flex-shrink-0">
                  {/* ...existing icon... */}
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
                <div className="bg-[#E6E320] rounded-lg p-2.5 flex-shrink-0">
                  {/* ...existing icon... */}
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

              {/* Alertas - Vermelho (usando Pendente como "alerta") */}
              <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="bg-[#F21515] rounded-lg p-2.5 flex-shrink-0">
                  {/* ...existing icon... */}
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[18px] text-[#F21515] font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Alertas
                  </div>
                  <div className="text-xl text-[#F21515] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {metrics.pendente}
                  </div>
                </div>
              </div>

              {/* Total de Máquinas - Azul */}
              <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="bg-[#0084FF] rounded-lg p-2.5 flex-shrink-0">
                  {/* ...existing icon... */}
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
            {/* Coluna esquerda: Últimas Manutenções (lista baseada em status Manutenção) */}
            <div className="flex flex-col">
              <div className="bg-white rounded-[10px] p-6 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center gap-[7px] mb-[21px]">
                  {/* ...existing icon... */}
                  <svg className="w-7 h-[27px] text-[#373535]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <h2 className="text-[#373535] text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Últimas Manutenções
                  </h2>
                </div>
                <div className="space-y-2 overflow-y-auto flex-1">
                  {manutencoes.length === 0 ? (
                    <div className="text-sm text-gray-500">Nenhum registro.</div>
                  ) : manutencoes.map((m) => (
                    <div key={m.id} className="bg-[#D9D9D970] rounded-lg p-4 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-black text-[14px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          {m.name}
                        </span>
                        <StatusBadge status={m.status} />
                      </div>
                      <p className="text-[#595454] text-[12px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                        Preventiva - {m.acquisitionDate || 'dd/mm/aaaa'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna direita: Previsões (baseado em status Pendente) */}
            <div className="flex flex-col">
              <div className="bg-white rounded-[10px] p-6 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center gap-[7px] mb-[21px]">
                  {/* ...existing icon... */}
                  <svg className="w-7 h-[27px] text-[#373535]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                  <h2 className="text-[#373535] text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Previsões
                  </h2>
                </div>
                <div className="space-y-2 overflow-y-auto flex-1">
                  {previsoes.length === 0 ? (
                    <div className="text-sm text-gray-500">Nenhuma previsão.</div>
                  ) : previsoes.map((m) => (
                    <div key={m.id} className="bg-[#D9D9D970] rounded-lg p-4 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-black text-[14px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          {m.name}
                        </span>
                        <StatusBadge status={m.status} />
                      </div>
                      <p className="text-[#595454] text-[12px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                        Preventiva - {m.acquisitionDate || 'dd/mm/aaaa'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home;