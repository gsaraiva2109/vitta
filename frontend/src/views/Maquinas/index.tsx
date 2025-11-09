import Sidebar from "../../components/Sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useState, useMemo, useRef, useEffect } from "react";
import CreateMachine from "./CreateMachine";
import EditMachine from "./EditMachine";
import type { Machine } from "../../models/Machine";
import {
  loadMachines,
  addMachine as ctrlAdd,
  updateMachine as ctrlUpdate,
  removeMachine as ctrlRemove,
} from "../../controllers/machinesController";
import ViewMachine from "./ViewMachine";



const Maquinas = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const fetchMachines = async () => {
    const data = await loadMachines();
    setMachines(data);
  };
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Machine | null>(null);
  const [viewTarget, setViewTarget] = useState<Machine | null>(null);
  const toast = useRef<Toast | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleCreate = async (payload: Omit<Machine, "id">) => {
    const newMachine = await ctrlAdd(payload);
    if (newMachine) {
      fetchMachines(); // Reload all machines from API
      setShowCreate(false);
      toast.current?.show({
        severity: "success",
        summary: "Máquina adicionada",
        detail: "Registro criado com sucesso.",
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao adicionar máquina.",
      });
    }
  };

  const handleUpdate = async (updated: Machine) => {
    const result = await ctrlUpdate(updated);
    if (result) {
      fetchMachines(); // Reload all machines from API
      setEditTarget(null);
      toast.current?.show({
        severity: "success",
        summary: "Máquina atualizada",
        detail: "Alterações salvas.",
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao atualizar máquina.",
      });
    }
  };

  const normalizeStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("manuten") || s.includes("manutenção")) return "manutencao";
    if (s.includes("inativ")) return "inativo";
    if (s.includes("ativ") && !s.includes("inativ")) return "ativo";
    if (s.includes("pend")) return "pendente";
    return "outro";
  };

  const filterOptions = [
    { label: "Todos os status", value: "" },
    { label: "Ativos", value: "ativo" },
    { label: "Inativos", value: "inativo" },
    { label: "Em Manutenção", value: "manutencao" },
  ];

  const badgeForStatus = (status: string | null | undefined) => {
    const normalized = normalizeStatus(status || "");
    if (normalized === "manutencao")
      return "bg-[#DBD83B] text-gray-800";
    if (normalized === "inativo") return "bg-[#D2D1D1] text-gray-800";
    if (normalized === "ativo") return "bg-[#8AE67E] text-gray-800";
    if (normalized === "pendente") return "bg-[#D95555] text-gray-800";
    return "bg-gray-100 text-gray-700";
  };

  const filteredMachines = useMemo(() => {
    const q = search.trim().toLowerCase();
    return machines.filter((machine) => {
      if (selectedFilter) {
        const normalized = normalizeStatus(machine.status);
        if (normalized !== selectedFilter) return false;
      }
      if (!q) return true;
      return (
        machine.name.toLowerCase().includes(q) ||
        machine.patrimony.toLowerCase().includes(q)
      );
    });
  }, [search, selectedFilter, machines]);

  const handleDeleteRequest = (machineId: string) => {
    setMachineToDelete(machineId);
    setConfirmVisible(true);
  };

  const acceptDelete = async () => {
    if (machineToDelete) {
      const success = await ctrlRemove(machineToDelete);
      if (success) {
        fetchMachines(); // Reload all machines from API
        toast.current?.show({
          closable: false,
          severity: 'error',
          summary: 'Máquina removida',
          style: { minWidth: '20rem' },
          icon() {
            return <i className="pi pi-times-circle" style={{ fontSize: '2rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginTop: '0.5rem' }}></i>;
          },
          detail: 'A máquina foi excluída e não poderá ser recuperada.',
        });
      } else {
        toast.current?.show({
          closable: false,
          severity: 'error',
          summary: 'Erro',
          style: { minWidth: '20rem' },
          icon() {
            return <i className="pi pi-times-circle" style={{ fontSize: '2rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginTop: '0.5rem' }}></i>;
          },
          detail: 'Falha ao remover máquina.',
        });
      }
    }
    setMachineToDelete(null);
    setConfirmVisible(false);
  };

  const rejectDelete = () => {
    toast.current?.show({
      closable: false,
      severity: 'info',
      summary: 'Ação cancelada',
      style: { minWidth: '20rem' },
      icon() {
        return <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginTop: '0.5rem' }}></i>;
      },
      detail: 'A exclusão foi cancelada.',
    });
    setMachineToDelete(null);
    setConfirmVisible(false);
  };

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => (setConfirmVisible(false), setMachineToDelete(null))}
        message="Tem certeza que deseja remover esta máquina?"
        header={() => (
          <span className="font-semibold ml-2">Confirmação</span>
        )}
        icon={() => (
          <i
            className="pi pi-exclamation-triangle"
            style={{
              fontSize: "2rem",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          ></i>
        )}
        accept={acceptDelete}
        reject={rejectDelete}
        style={{ width: "36rem" }}
        showCloseIcon={false}
        breakpoints={{ "1100px": "90vw", "960px": "100vw" }}
        acceptClassName="bg-red-500 mr-2 mb-2 text-white hover:bg-red-600"
        rejectClassName="bg-gray-100 mr-2 mb-2 text-gray-700 hover:bg-gray-200"
        closeOnEscape={true}
        acceptLabel="Remover"
        rejectLabel="Cancelar"
      />
      <Sidebar currentPage="maquinas" />
      <div className="flex-1 h-full flex flex-col">
        <div className="p-8 flex-shrink-0">
          {/* Header com título e botão */}
          <div className="flex items-start justify-between">
            <div>
              <h1
                className="text-[48px] font-semibold text-black mb-2"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                Máquinas hospitalares
              </h1>
              <p
                className="text-base text-[#767575]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
              >
                Gerencie o cadastro de máquinas e equipamentos
              </p>
            </div>

            {/* Botão Nova Máquina */}
            <button
              className="bg-[#0084FF] hover:bg-[#0073E6] text-white font-semibold mt-20 px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 transform
                         shadow-[0_12px_30px_rgba(0,132,255,0.18)] hover:shadow-[0_20px_45px_rgba(0,132,255,0.22)]
                         active:translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#0084FF33] focus:ring-offset-2"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              onClick={() => setShowCreate(true)}
            >
              <i className="pi pi-plus" style={{ fontSize: "1.5rem"}}></i>
              <span className="text-lg">Nova Máquina</span>
            </button>
          </div>

          {/* Container arredondado com as barras de busca e filtro */}
          <div className="bg-white rounded-2xl mt-8 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 w-full items-center">
              {/* Input de Busca */}
              <div className="flex-1 relative">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-400 transition z-10"
                >
                  <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                </svg>
                <InputText
                  placeholder="Buscar por nome ou patrimônio"
                  value={search}
                  onChange={(e) =>
                    setSearch((e.target as HTMLInputElement).value)
                  }
                  className="w-full h-[48px] pl-12 pr-4 text-sm rounded-xl border border-gray-200 shadow-sm"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400
                  }}
                />
              </div>

              {/* Dropdown de Filtro */}
              <div className="w-full sm:w-[280px] relative">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-400 transition z-10"
                >
                  <path d="M2.75 3h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5ZM5 7.75A.75.75 0 0 1 5.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 7.75ZM7.75 11.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM10 15.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z" />
                </svg>
                <Dropdown
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.value)}
                  options={filterOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todos os status"
                  className="w-full h-[52px] pl-12 rounded-xl border border-gray-200 shadow-sm"
                  panelClassName="rounded-xl"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista vertical de cards: ocupa o resto da altura e é scrollable */}
        <div className="px-8 pb-8 pt-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {filteredMachines.length === 0 ? (
              <div className="text-center text-gray-500 py-12">Nenhuma máquina encontrada.</div>
            ) : filteredMachines.map((m) => (
               <div key={m.id} className="w-full bg-white rounded-xl shadow-sm p-4 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  {/* Left: título e patrimônio */}
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-700 font-semibold" style={{ fontFamily: 'Poppins, sans-serif'}}>{m.name}</h3>
                    <div className="text-base text-gray-500 mt-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                      Patrimônio: <span className="text-gray-500 font-medium">{m.patrimony}</span>
                    </div>
                  </div>

                    {/* Right: status (top) and two icon buttons below */}
                    <div className="flex flex-col items-end mr-8">
                      <div
                        className={`w-36 h-7 mr-3 flex items-center justify-center truncate text-sm rounded-full ${badgeForStatus(m.status)} shadow-[0_6px_18px_rgba(0,0,0,0.08)]`}
                        title={m.status}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {(m.status || 'N/A')}
                      </div>

                      <div className="mt-2 flex items-center">
                        <button
                          className="p-button-text p-button-plain"
                          style={{
                            color: "black",
                            background: "transparent",
                            border: "none",
                          }}
                          onClick={() => setViewTarget(m)}
                          aria-label={`Visualizar ${m.name}`}
                          title="Visualizar"
                        >
                          <i className="pi pi-eye"></i>
                        </button>
                        <button
                          className="p-button-text p-button-plain"
                          style={{
                            color: "blue",
                            background: "transparent",
                            border: "none",
                          }}
                          onClick={() => setEditTarget(m)}
                          aria-label={`Editar ${m.name}`}
                        >
                          <i className="pi pi-pen-to-square"></i>
                        </button>
                        <button
                          className="p-button-text p-button-plain"
                          style={{
                            color: "red",
                            background: "transparent",
                            border: "none",
                          }}
                          onClick={() => handleDeleteRequest(m.id)}
                          aria-label={`Remover ${m.name}`}
                        >
                          <i className="pi pi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Campos solicitados */}
                  <div
                    className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-600"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    <div>
                      <div className="font-medium text-gray-700 ">Função</div>
                      <div className="text-gray-500 font-xs mb-0.5">
                        {m.funcao}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-0.5">
                        Fabricante
                      </div>
                      <div className="text-gray-500 font-xs mb-0.5">
                        {m.fabricante}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">
                        Data de aquisição
                      </div>
                      <div className="text-gray-500 font-xs mb-0.5">
                        {m.acquisitionDate}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">
                        Localização
                      </div>
                      <div className="text-gray-500 font-xs mb-0.5">
                        {m.location}
                      </div>
                    </div>
                  </div>

                  {/* footer com id à direita */}
                  <div className="mt-4 flex items-center justify-end">
                    <div className="text-xs text-gray-400">{m.id}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {viewTarget && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[820px] rounded-3xl bg-white shadow-2xl">
              <ViewMachine
                machine={viewTarget}
                onCancel={() => setViewTarget(null)}
              />
            </div>
          </div>
        )}
        {showCreate && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[820px] rounded-3xl bg-white shadow-2xl">
              <CreateMachine
                onCancel={() => setShowCreate(false)}
                onSubmit={handleCreate}
              />
            </div>
          </div>
        )}
        {editTarget && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[820px] rounded-3xl bg-white shadow-2xl">
              <EditMachine
                machine={editTarget}
                onCancel={() => setEditTarget(null)}
                onSubmit={handleUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maquinas;
