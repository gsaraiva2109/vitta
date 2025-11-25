import Sidebar from "../../components/Sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import 'primeicons/primeicons.css';
import { useEffect, useMemo, useRef, useState } from "react";
import type { Maintenance } from "../../models/Maintenance";
import { 
    loadMaintenancesFromAPI, 
    createMaintenanceAPI, 
    updateMaintenanceAPI, 
    deleteMaintenanceAPI 
} from "../../controllers/maintenancesApiController";
import { getUser } from "../../services/authService";
import CreateMaintenance from "./CreateMaintenance";
import EditMaintenance from "./EditMaintenance";
import ViewMaintenance from "./ViewMaintenance";

const normalizeMaintStatus = (s: string) => {
  const v = (s || "").toLowerCase();
  if (v.includes("andament")) return "andamento";
  if (v.includes("conclu")) return "concluida";
  if (v.includes("cancel")) return "cancelada";
  if (v.includes("pendent")) return "pendente";
  return "outro";
};

const badgeForMaintStatus = (status: string) => {
  const s = normalizeMaintStatus(status);
  if (s === "concluida") return "bg-[#8AE67E] text-gray-800";
  if (s === "andamento") return "bg-[#DBD83B] text-gray-800";
  if (s === "cancelada") return "bg-[#D2D1D1] text-gray-800";
  if (s === "pendente") return "bg-[#D9D555] text-gray-800";
  return "bg-gray-100 text-gray-700";
};

const Manutencoes = () => {
  const toast = useRef<Toast | null>(null);
  const [list, setList] = useState<Maintenance[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(""); // Todos os status
  const [typeFilter, setTypeFilter] = useState<string>(""); // Todos os tipos
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [viewTarget, setViewTarget] = useState<Maintenance | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getUser();
  const isManager = user?.tipo === 'manager';

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await loadMaintenancesFromAPI();
            setList(data);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar manutenções';
            setError(errorMsg);
            toast.current?.show({
                severity: "error",
                summary: "Erro ao carregar",
                detail: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const statusOptions = [
    { label: "Todos os status", value: "" },
    { label: "Concluída", value: "concluida" },
    { label: "Em Andamento", value: "andamento" },
    { label: "Cancelada", value: "cancelada" },
    { label: "Pendente", value: "pendente" },
  ];

  const typeOptions = [
    { label: "Todos os tipos", value: "" },
    { label: "Corretiva", value: "corretiva" },
    { label: "Preventiva", value: "preventiva" },
    { label: "Calibração", value: "calibracao" },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter(m => {
      // status
      if (statusFilter) {
        if (normalizeMaintStatus(m.status) !== statusFilter) return false;
      }
      // tipo
      if (typeFilter) {
        const t = (m.tipoManutencao || "").toLowerCase();
        if (!t.includes(typeFilter)) return false;
      }
      // busca por nome da máquina
      if (!q) return true;
      return (m.machineName || "").toLowerCase().includes(q);
    });
  }, [list, search, statusFilter, typeFilter]);

  const handleDeleteRequest = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    setToDelete(numId);
    setConfirmVisible(true);
  };

  const acceptDelete = async () => {
    if (toDelete) {
        try {
            await deleteMaintenanceAPI(toDelete);
            setList(prev => prev.filter(m => m.id != toDelete.toString()));
            toast.current?.show({
              closable: false,
              severity: 'error',
              summary: 'Manutenção removida',
              detail: 'O registro foi excluído.',
            });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar manutenção';
            toast.current?.show({
              severity: "error",
              summary: "Erro",
              detail: errorMsg,
            });
        }
    }
    setToDelete(null);
    setConfirmVisible(false);
  };

  const rejectDelete = () => {
    toast.current?.show({
      severity: 'info',
      icon() {
        return <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginTop: '0.5rem' }}></i>;
      },
      closable: false,
      summary: 'Ação cancelada',
      detail: 'Exclusão cancelada.',
    });
    setToDelete(null);
    setConfirmVisible(false);
  };

  const handleCreate = async (data: Omit<Maintenance, 'id'>) => {
    try {
        const newMaintenance = await createMaintenanceAPI(data);
        setList(prev => [...prev, newMaintenance]);
        setShowCreate(false);
        toast.current?.show({ severity: 'success', summary: 'Manutenção adicionada', detail: 'Registro criado com sucesso.' });
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao criar manutenção';
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: errorMsg });
    }
  };

  const handleUpdate = async (data: Maintenance) => {
    try {
        const maintenanceId = typeof data.id === 'string' ? parseInt(data.id) : data.id;
        const updated = await updateMaintenanceAPI(maintenanceId, data);
        setList(prev => prev.map(m => (m.id === data.id ? updated : m)));
        setEditTarget(null);
        toast.current?.show({ severity: 'success', summary: 'Manutenção atualizada', detail: 'Alterações salvas.' });
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar manutenção';
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: errorMsg });
    }
  };

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => (setConfirmVisible(false), setToDelete(null))}
        message="Tem certeza que deseja remover esta manutenção?"
        header={<span className="font-semibold ml-2">Confirmação</span>}
        icon={<i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginTop: '0.5rem' }}></i>}
        accept={acceptDelete}
        reject={rejectDelete}
        style={{ width: '36rem' }}
        showCloseIcon={false}
        breakpoints={{ '1100px': '90vw', '960px': '100vw' }}
        acceptClassName="bg-red-500 mr-2 mb-2 text-white hover:bg-red-600"
        rejectClassName="bg-gray-100 mr-2 mb-2 text-gray-700 hover:bg-gray-200"
        closeOnEscape={true}
        acceptLabel="Remover"
        rejectLabel="Cancelar"
      />

      <Sidebar currentPage="manutencoes" />
      <div className="flex-1 h-full flex flex-col">
        <div className="p-8 flex-shrink-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[48px] font-semibold text-black mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Manutenções
              </h1>
              <p className="text-base text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                Histórico de manutenções das máquinas
              </p>
            </div>

            {/* Botão Nova Manutenção */}
            <button
              disabled={!isManager}
              className={`bg-[#0084FF] text-white font-semibold mt-20 px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 transform shadow-[0_12px_30px_rgba(0,132,255,0.18)] 
                         ${isManager ? 'hover:bg-[#0073E6] hover:shadow-[0_20px_45px_rgba(0,132,255,0.22)] active:translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#0084FF33] focus:ring-offset-2' : 'opacity-50 cursor-not-allowed'}`}
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              onClick={() => isManager && setShowCreate(true)}
            >
              <i className="pi pi-plus" style={{ fontSize: '1.5rem' }} />
              <span className="text-base">Nova Manutenção</span>
            </button>
          </div>

          {/* Barra de filtros */}
          <div className="bg-white rounded-2xl mt-8 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row w-full gap-4 items-center">
              {/* Busca */}
              <div className="flex-1 relative">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-400">
                  <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                </svg>
                <InputText
                  placeholder="Buscar por máquina"
                  value={search}
                  onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
                  className="w-full h-[48px] pl-12 pr-4 text-sm rounded-xl border border-gray-200 shadow-sm"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
                />
              </div>

              {/* Filtro Status */}
              <div className="w-full lg:w-[260px] relative">
                <i className="pi pi-filter absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Dropdown
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.value)}
                  options={statusOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todos os status"
                  className="w-full h-[48px] pl-10 rounded-xl border border-gray-200 shadow-sm"
                  panelClassName="rounded-xl"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
                />
              </div>

              {/* Filtro Tipo */}
              <div className="w-full lg:w-[260px] relative">
                <i className="pi pi-filter-fill absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Dropdown
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.value)}
                  options={typeOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todos os tipos"
                  className="w-full h-[48px] pl-10 rounded-xl border border-gray-200 shadow-sm"
                  panelClassName="rounded-xl"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de cards */}
        <div className="px-8 pb-8 pt-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="text-center text-gray-500 py-12">Carregando...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-12">Erro: {error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-12">Nenhuma manutenção encontrada.</div>
            ) : filtered.map((m) => (
              <div key={m.id} className="w-full bg-white rounded-xl shadow-sm px-6 py-5 transition-shadow duration-300 hover:shadow-md">
                <div className="flex w-full items-start justify-between gap-4">
                  {/* Título e Status */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {m.machineName}
                    </h3>
                  </div>
                  
                  {/* Badge e Ações */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div
                      className={`w-auto px-4 h-7 flex items-center justify-center text-sm font-medium rounded-full ${badgeForMaintStatus(m.status)} shadow-[0_4px_12px_rgba(0,0,0,0.08)]`}
                      title={m.status}
                    >
                      {m.status}
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => setViewTarget(m)}
                        aria-label={`Visualizar ${m.machineName}`}
                        title="Visualizar"
                      >
                        <i className="pi pi-eye text-gray-600"></i>
                      </button>
                      <button
                        className={`p-2 rounded-full transition-colors ${isManager ? 'hover:bg-blue-100' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!isManager}
                        onClick={() => isManager && setEditTarget(m)}
                        aria-label={`Editar ${m.machineName}`}
                        title="Editar"
                      >
                        <i className="pi pi-pen-to-square text-blue-500"></i>
                      </button>
                      <button
                        className={`p-2 rounded-full transition-colors ${!isManager ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'}`}
                        disabled={!isManager}
                        onClick={() => isManager && handleDeleteRequest(m.id)}
                        aria-label={`Excluir ${m.machineName}`}
                        title="Excluir"
                      >
                        <i className="pi pi-trash text-red-500"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detalhes da Manutenção */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">Tipo</span>
                      <span className="text-gray-600">{m.tipoManutencao}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">Responsável</span>
                      <span className="text-gray-600">{m.responsavel}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">Custo</span>
                      <span className="text-gray-600">R$ {m.valor.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">Data</span>
                      <span className="text-gray-600">{m.dataManutencao || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">Próxima Prevista</span>
                      <span className="text-gray-600">{m.dataProxima || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">Empresa</span>
                      <span className="text-gray-600">{m.empresaResponsavel || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Descrição */}
                  {m.observacao && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700">Descrição</h4>
                      <p className="text-gray-600 text-sm mt-1 bg-gray-50 p-3 rounded-lg">
                        {m.observacao}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer com ID */}
                <div className="mt-3 flex items-center justify-end">
                  <div className="text-xs text-gray-400">ID: {m.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay de visualização (fecha com ESC e botão no topo direito) */}
        {viewTarget && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[820px] rounded-3xl bg-white shadow-2xl">
              <ViewMaintenance
                maintenance={viewTarget}
                onCancel={() => setViewTarget(null)}
              />
            </div>
          </div>
        )}

        {/* Nova Manutenção */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[820px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
              {/* Conteúdo scrollável */}
             <div className="max-h-[90vh] overflow-y-auto px-6 py-8">
                <CreateMaintenance onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />

               
               </div>
             </div>
          </div>
        )}

        {/* Editar Manutenção */}
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[820px] rounded-2xl bg-white shadow-2xl">
              <EditMaintenance maintenance={editTarget} onCancel={() => setEditTarget(null)} onSubmit={handleUpdate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manutencoes;
