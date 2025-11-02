import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import type { Machine } from '../../models/Machine';
import { isoToBR } from '../../controllers/machinesController';

type CreatePayload = Omit<Machine, 'id'>;

interface Props {
  onCancel: () => void;
  onSubmit: (data: CreatePayload) => void;
}

const CreateMachine = ({ onCancel, onSubmit }: Props) => {
  const [form, setForm] = useState<CreatePayload>({
    name: '',
    patrimony: '',
    funcao: '',
    maintenanceInterval: '',
    calibrationInterval: '',
    acquisitionDate: '',
    serialNumber: '',
    fabricante: '',
    modelo: '',
    rcOc: '',
    location: '',
    status: 'Ativo',
    observacoes: '',
  });

  const handle = (k: keyof CreatePayload, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof CreatePayload)[] = ['name', 'patrimony', 'funcao', 'acquisitionDate', 'serialNumber'];
    if (required.some(f => !form[f])) return alert('Preencha os campos obrigatórios.');
    onSubmit({ ...form, acquisitionDate: isoToBR(form.acquisitionDate) });
  };

  return (
    <form onSubmit={submit} className="flex flex-col">
      <header className="px-8 pt-8 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
          Nova Máquina
        </h2>
      </header>

      <div className="px-8 pb-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Nome da Máquina *</label>
            <InputText value={form.name} onChange={(e) => handle('name', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Patrimônio *</label>
            <InputText value={form.patrimony} onChange={(e) => handle('patrimony', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Função *</label>
            <InputText value={form.funcao} onChange={(e) => handle('funcao', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Intervalo entre Manutenções (em meses)</label>
            <InputText value={form.maintenanceInterval} onChange={(e) => handle('maintenanceInterval', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Data de Aquisição *</label>
            <input type="date" value={form.acquisitionDate} onChange={(e) => handle('acquisitionDate', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] text-gray-700" style={{ fontFamily: 'Poppins, sans-serif', colorScheme: 'light' }} />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Intervalo entre Calibrações (em meses)</label>
            <InputText value={form.calibrationInterval} onChange={(e) => handle('calibrationInterval', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Número de Série *</label>
            <InputText value={form.serialNumber} onChange={(e) => handle('serialNumber', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select value={form.status} onChange={(e) => handle('status', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33]">
              <option value="Ativo">Ativo</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Pendente">Pendente</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Fabricante</label>
            <InputText value={form.fabricante} onChange={(e) => handle('fabricante', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <InputText value={form.modelo} onChange={(e) => handle('modelo', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">RC/OC</label>
            <InputText value={form.rcOc} onChange={(e) => handle('rcOc', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Localização</label>
            <InputText value={form.location} onChange={(e) => handle('location', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea value={form.observacoes || ''} onChange={(e) => handle('observacoes', e.target.value)} className="w-full min-h-[96px] rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
        </div>
      </div>

      <footer className="flex justify-end gap-4 border-t border-gray-200 px-8 py-5">
        <button type="button" onClick={onCancel} className="h-11 rounded-xl bg-[#F4F4F4] px-6 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-[#0084FF33]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
          Cancelar
        </button>
        <button type="submit" className="h-11 rounded-xl bg-[#0084FF] px-7 text-white hover:bg-[#0073E6] focus:outline-none focus:ring-4 focus:ring-[#0084FF33]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
          Adicionar
        </button>
      </footer>
    </form>
  );
};

export default CreateMachine;
