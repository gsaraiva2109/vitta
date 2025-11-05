import { useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import type { Machine } from '../../models/Machine';
import { brToISO } from '../../controllers/machinesController';

interface Props {
  machine: Machine;
  onCancel: () => void;
}

const ViewMachine = ({ machine, onCancel }: Props) => {
  const acquisitionISO = useMemo(() => brToISO(machine.acquisitionDate), [machine.acquisitionDate]);

  return (
    <form className="flex flex-col">
        <header className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            Visualizar Máquina
          </h2>
        </header>

        <div className="px-8 pb-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Nome da Máquina *</label>
              <InputText value={machine.name} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Patrimônio *</label>
              <InputText value={machine.patrimony} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Função *</label>
              <InputText value={machine.funcao} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Intervalo entre Manutenções (em meses)</label>
              <InputText value={machine.maintenanceInterval || ''} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Data de Aquisição *</label>
              <input type="date" value={acquisitionISO} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] text-gray-700" style={{ fontFamily: 'Poppins, sans-serif', colorScheme: 'light' }} />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Intervalo entre Calibrações (em meses)</label>
              <InputText value={machine.calibrationInterval || ''} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Número de Série *</label>
              <InputText value={machine.serialNumber || ''} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select value={machine.status} disabled className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33]">
                <option value="Ativo">Ativo</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Pendente">Pendente</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Fabricante</label>
              <InputText value={machine.fabricante} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <InputText value={machine.modelo || ''} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">RC/OC</label>
              <InputText value={machine.rcOc || ''} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Localização</label>
              <InputText value={machine.location} readOnly className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea value={machine.observacoes || ''} readOnly className="w-full min-h-[96px] rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] resize-none" />
            </div>
            
            {machine.status === 'Inativo' && machine.justificativaInativo && (
              <div className="md:col-span-2 flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Justificativa (Inativo)</label>
                <textarea value={machine.justificativaInativo} readOnly className="w-full min-h-[96px] rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] resize-none" />
              </div>
            )}
          </div>
        </div>

        <footer className="flex justify-end gap-4 border-t border-gray-200 px-8 py-5">
          <button type="button" onClick={onCancel} className="h-11 rounded-xl bg-[#0084FF] px-7 text-white hover:bg-[#0073E6] focus:outline-none focus:ring-4 focus:ring-[#0084FF33]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            Fechar
          </button>
        </footer>
      </form>
  );
};

export default ViewMachine;
