import { useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import type { Maintenance } from "../../models/Maintenance";

interface Props {
  maintenance: Maintenance;
  onCancel: () => void;
}

const statusOptions = [
  { label: "Concluída", value: "Concluida" },
  { label: "Em Andamento", value: "Em Andamento" },
  { label: "Cancelada", value: "Cancelada" },
  { label: "Pendente", value: "Pendente" },
];

const typeOptions = [
  { label: "Corretiva", value: "Corretiva" },
  { label: "Preventiva", value: "Preventiva" },
  { label: "Calibração", value: "Calibração" },
];

const brToISO = (br: string) => {
  if (!br) return "";
  const [d, m, y] = br.split("/");
  return `${y}-${m}-${d}`;
};

const formatBRL = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

const ViewMaintenance = ({ maintenance, onCancel }: Props) => {
  const dataManutencaoISO = useMemo(
    () => brToISO(maintenance.dataManutencao || ""),
    [maintenance.dataManutencao]
  );
  const formattedValor = formatBRL(maintenance.valor);

  return (
    <form className="flex flex-col">
      <header className="px-8 pt-8 pb-4">
        <h2
          className="text-2xl font-semibold text-gray-900"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
        >
          Visualizar Manutenção
        </h2>
      </header>

      <div className="px-8 pb-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Máquina *
            </label>
            <InputText
              value={maintenance.machineName}
              readOnly
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Valor *
            </label>
            <InputText
              value={formattedValor}
              readOnly
              placeholder="R$ xxxx,xx"
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <Dropdown
              value={maintenance.tipoManutencao}
              options={typeOptions}
              optionLabel="label"
              optionValue="value"
              disabled
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm"
              panelClassName="rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <Dropdown
              value={maintenance.status}
              options={statusOptions}
              optionLabel="label"
              optionValue="value"
              disabled
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm"
              panelClassName="rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Responsável *
            </label>
            <InputText
              value={maintenance.responsavel}
              readOnly
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Data da Manutenção
            </label>
            <input
              type="date"
              value={dataManutencaoISO}
              readOnly
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] text-gray-700"
              style={{
                fontFamily: "Poppins, sans-serif",
                colorScheme: "light",
              }}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Empresa responsável
            </label>
            <InputText
              value={maintenance.empresaResponsavel}
              readOnly
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              RC/OC *
            </label>
            <InputText
              value={maintenance.rcOc || ""}
              readOnly
              className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]"
            />
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={maintenance.observacao || ""}
              readOnly
              className="w-full min-h-24 rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] resize-none"
            />
          </div>
        </div>
      </div>

      <footer className="flex justify-end gap-4 border-t border-gray-200 px-8 py-5">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-xl bg-[#0084FF] px-7 text-white hover:bg-[#0073E6] focus:outline-none focus:ring-4 focus:ring-[#0084FF33]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
        >
          Fechar
        </button>
      </footer>
    </form>
  );
};

export default ViewMaintenance;
