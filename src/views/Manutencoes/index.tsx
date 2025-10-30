import Sidebar from "../../components/Sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import 'primeicons/primeicons.css';
import { useEffect, useMemo, useRef, useState } from "react";
import type { Maintenance } from "../../models/Maintenance";
import { loadMaintenances, removeMaintenance, addMaintenance, updateMaintenance } from "../../controllers/maintenancesController";
import CreateMaintenance from "./CreateMaintenance";
import EditMaintenance from "./EditMaintenance";

const initialMaintenances: Maintenance[] = [
  {
    id: "MT-001",
    machineName: "Aparelho",
    type: "Corretiva",
    responsible: "Responsável",
    company: "xxxxxxxx",
    cost: 0,
    performedDate: "01/01/2024",
    nextDate: "01/04/2024",
    status: "Concluida",
    rcOc: "",
    observacoes: "",
  },
  {
    id: "MT-002",
    machineName: "Aparelho",
    type: "Corretiva",
    responsible: "Responsável",
    company: "xxxxxxxx",
    cost: 0,
    performedDate: "10/02/2024",
    nextDate: "10/05/2024",
    status: "Em Andamento",
    rcOc: "",
    observacoes: "",
  },
  {
    id: "MT-003",
    machineName: "Aparelho",
    type: "Corretiva",
    responsible: "Responsável",
    company: "xxxxxxxx",
    cost: 0,
    performedDate: "12/02/2024",
    nextDate: "12/05/2024",
    status: "Cancelada",
    rcOc: "",
    observacoes: "",
  },
];

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
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [viewTarget, setViewTarget] = useState<Maintenance | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Maintenance | null>(null);

  useEffect(() => {
    setList(loadMaintenances(initialMaintenances));
  }, []);

  // Fechar visualização com ESC
  useEffect(() => {
    if (!viewTarget) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setViewTarget(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewTarget]);

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
        const t = (m.type || "").toLowerCase();
        if (!t.includes(typeFilter)) return false;
      }
      // busca por nome da máquina
      if (!q) return true;
      return (m.machineName || "").toLowerCase().includes(q);
    });
  }, [list, search, statusFilter, typeFilter]);

  const handleDeleteRequest = (id: string) => {
    setToDelete(id);
    setConfirmVisible(true);
  };

  const acceptDelete = () => {
    if (toDelete) {
      setList(prev => removeMaintenance(prev, toDelete));
      toast.current?.show({
        closable: false,
        severity: 'error',
        icon() {
          return <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginTop: '0.5rem' }}></i>;
        },
        summary: 'Manutenção removida',
        detail: 'O registro foi excluído.',
      });
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

  const handleCreate = (data: Omit<Maintenance, 'id'> & { rcOc?: string; observacoes?: string }) => {
    setList(prev => addMaintenance(prev, {
      machineName: data.machineName,
      cost: data.cost ?? 0,
      type: data.type,
      responsible: data.responsible,
      company: data.company ?? '',
      performedDate: data.performedDate,
      nextDate: data.nextDate ?? '',
      status: data.status,
      rcOc: data.rcOc ?? '',
      observacoes: data.observacoes ?? '',
    }));
    setShowCreate(false);
    toast.current?.show({ severity: 'success', summary: 'Manutenção adicionada', detail: 'Registro criado com sucesso.', closable: false });
  };

  const handleUpdate = (data: Maintenance) => {
    setList(prev => updateMaintenance(prev, data));
    setEditTarget(null);
    toast.current?.show({ severity: 'success', summary: 'Manutenção atualizada', detail: 'Alterações salvas.' });
  };

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => (setConfirmVisible(false), setToDelete(null))}
        message="Tem certeza que deseja remover esta manutenção?"
        header={options => <span className="font-semibold ml-2">Confirmação</span>}
        icon={options => <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginTop: '0.5rem' }}></i>}
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
              className="bg-[#0084FF] hover:bg-[#0073E6] text-white font-semibold mt-20 px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 transform shadow-[0_12px_30px_rgba(0,132,255,0.18)] hover:shadow-[0_20px_45px_rgba(0,132,255,0.22)] active:translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#0084FF33] focus:ring-offset-2"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              onClick={() => setShowCreate(true)}
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
            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-12">Nenhuma manutenção encontrada.</div>
            ) : filtered.map((m) => (
              <div key={m.id} className="w-full bg-white rounded-xl shadow-sm px-5 py-4">
                <div className="flex w-full items-start gap-3">
                  {/* Esquerda: título e subtítulo */}
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-700 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {m.machineName}
                    </h3>
                    <div className="text-base text-gray-500 mt-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                      {m.type} - {m.responsible}
                    </div>
                    {/* Linhas info */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                      <div>
                        <div className="text-base font-medium text-gray-700">Custo</div>
                        <div className="text-gray-500 font-xs mb-0.5">R$ {m.cost.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-700">Data realizada</div>
                        <div className="text-gray-500 font-xs mb-0.5">{m.performedDate || 'dd/mm/aaaa'}</div>
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-700">Empresa</div>
                        <div className="text-gray-500 font-xs mb-0.5">{m.company}</div>
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-700">Próxima manutenção</div>
                        <div className="text-gray-500 font-xs mb-0.5">{m.nextDate || 'dd/mm/aaaa'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Direita: badge + ações */}
                  <div className="ml-auto flex flex-col items-end mr-8 flex-shrink-0">
                    <div
                      className={`w-36 h-7 mr-3 flex items-center justify-center truncate text-sm rounded-full ${badgeForMaintStatus(m.status)} shadow-[0_6px_18px_rgba(0,0,0,0.08)]`}
                      title={m.status}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {m.status}
                    </div>

                    <div className="mt-2 flex items-center">
                      <button
                        className="p-button-text p-button-plain"
                        style={{ color: 'black', background: 'transparent', border: 'none' }}
                        onClick={() => setViewTarget(m)}
                        aria-label={`Visualizar ${m.machineName}`}
                        title="Visualizar"
                      >
                        <i className="pi pi-eye"></i>
                      </button>
                      <button
                        className="p-button-text p-button-plain"
                        style={{ color: 'blue', background: 'transparent', border: 'none' }}
                        onClick={() => setEditTarget(m)}
                        aria-label={`Editar ${m.machineName}`}
                        title="Editar"
                      >
                        <i className="pi pi-pen-to-square"></i>
                      </button>
                      <button
                        className="p-button-text p-button-plain"
                        style={{ color: 'red', background: 'transparent', border: 'none' }}
                        onClick={() => handleDeleteRequest(m.id)}
                        aria-label={`Remover ${m.machineName}`}
                        title="Remover"
                      >
                        <i className="pi pi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                {/*footer com id da manutenção*/}
                <div className="mt-4 flex items-center justify-end">
                  <div className="text-xs text-gray-400"> {m.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay de visualização (fecha com ESC e botão no topo direito) */}
        {viewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="relative w-full max-w-[900px] rounded-2xl bg-white shadow-2xl">
              {/* Botão fechar (X) no canto superior direito */}
              <button
                aria-label="Fechar"
                onClick={() => setViewTarget(null)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                <i className="pi pi-times text-base" />
              </button>

              {/* Cabeçalho (título) */}
              <div className="px-8 pt-8 pb-3">
                <h2
                  className="text-[24px] font-semibold text-gray-900"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  Manutenção da {viewTarget.machineName}
                </h2>
              </div>

              {/* Corpo – 2 colunas conforme a imagem */}
              <div className="px-8 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-[15px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <div className="text-gray-900">
                    <span className="font-semibold">Responsável:</span> {viewTarget.responsible || '—'}
                  </div>
                  <div className="text-gray-900">
                    <span className="font-semibold">Valor:</span> R$ {viewTarget.cost.toFixed(2)}
                  </div>
                  <div className="text-gray-900">
                    <span className="font-semibold">Empresa responsável:</span> {viewTarget.company || '—'}
                  </div>
                  <div className="text-gray-900">
                    <span className="font-semibold">Tipo:</span> {viewTarget.type || '—'}
                  </div>
                  <div className="text-gray-900">
                    <span className="font-semibold">RC/OC:</span> {viewTarget.rcOc || '—'}
                  </div>
                  <div className="text-gray-900">
                    <span className="font-semibold">Status:</span> {viewTarget.status}
                  </div>
                  <div className="text-gray-900">
                    <span className="font-semibold">Data da Manutenção:</span> {viewTarget.performedDate || 'xx/xx/xxxx'}
                  </div>
                  <div className="text-gray-900 md:col-span-1">
                    {/* Espaço para manter a grade simétrica em telas médias */}
                  </div>
                  <div className="text-gray-900 md:col-span-2">
                    <span className="font-semibold">Observações:</span> {viewTarget.observacoes || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nova Manutenção */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[820px] rounded-2xl bg-white shadow-2xl">
              <CreateMaintenance onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />
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
