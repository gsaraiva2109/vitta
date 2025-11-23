import { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Toast from '../../components/CustomToast';
import { showToast, ToastMessages } from '../../components/CustomToast/toastUtils';
import type { Maintenance } from '../../models/Maintenance';
import { getAllMaquinas } from '../../services/maquinaService';
import type { Machine } from '../../models/Machine';

type CreatePayload = Omit<Maintenance, 'id'>;

interface Props {
  onCancel: () => void;
  onSubmit: (data: CreatePayload) => void;
}

const statusOptions = [
  { label: 'Concluída', value: 'Concluida' },
  { label: 'Em Andamento', value: 'Em Andamento' },
  { label: 'Cancelada', value: 'Cancelada' },
  { label: 'Pendente', value: 'Pendente' },
];

const typeOptions = [
  { label: 'Corretiva', value: 'Corretiva' },
  { label: 'Preventiva', value: 'Preventiva' },
  { label: 'Calibração', value: 'Calibração' },
];

const toBRDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

const parseBRLToNumber = (v: string) => {
  if (!v) return 0;
  const n = v.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = parseFloat(n);
  return isNaN(parsed) ? 0 : parsed;
};

const CreateMaintenance = ({ onCancel, onSubmit }: Props) => {
  const toast = useRef<Toast>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [form, setForm] = useState({
    idMaquina: '',
    cost: 'R$ ',
    type: 'Preventiva',
    status: 'Em Andamento',
    responsible: '',
    performedDate: '',
    company: '',
    rcOc: '',
    observacoes: '',
  });

  useEffect(() => {
    getAllMaquinas()
      .then(data => {
        setMachines(data);
      })
      .catch(() => showToast(toast, ToastMessages.generic.error));
  }, []);

  const handle = (k: keyof typeof form, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof typeof form)[] = ['idMaquina', 'cost', 'type', 'status', 'responsible', 'rcOc'];
    if (required.some(f => !String(form[f]).trim())) {
      showToast(toast, ToastMessages.validation.requiredFields);
      return;
    }
    const selectedMachine = machines.find(m => m.id === form.idMaquina);
    if (!selectedMachine) {
        showToast(toast, {
            severity: 'error',
            summary: 'Erro',
            detail: 'Máquina selecionada não encontrada.',
        });
        return;
    }

    const payload: CreatePayload = {
      idMaquina: form.idMaquina,
      machineName: selectedMachine.nome,
      cost: parseBRLToNumber(form.cost),
      type: form.type as Maintenance['type'],
      responsible: form.responsible,
      company: form.company,
      performedDate: toBRDate(form.performedDate),
      nextDate: '',
      status: form.status as Maintenance['status'],
      rcOc: form.rcOc,
      observacoes: form.observacoes,
    };
    showToast(toast, ToastMessages.manutencao.created);
    onSubmit(payload);
  };

  const machineOptions = machines.map(m => ({ label: m.nome, value: m.id }));

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={submit} className="flex flex-col">
      <header className="px-8 pt-8 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
          Nova Manutenção
        </h2>
      </header>

      <div className="px-8 pb-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Máquina *</label>
            <Dropdown value={form.idMaquina} onChange={(e) => handle('idMaquina', e.value)} options={machineOptions} optionLabel="label" optionValue="value" placeholder="Selecione uma máquina" className="w-full h-11 rounded-md border border-gray-300 shadow-sm" panelClassName="rounded-xl" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Valor *</label>
            <InputText value={form.cost} onChange={(e) => handle('cost', e.target.value)} placeholder="R$ xxxx,xx" className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <Dropdown value={form.type} onChange={(e) => handle('type', e.value)} options={typeOptions} optionLabel="label" optionValue="value" className="w-full h-11 rounded-md border border-gray-300 shadow-sm" panelClassName="rounded-xl" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Status *</label>
            <Dropdown value={form.status} onChange={(e) => handle('status', e.value)} options={statusOptions} optionLabel="label" optionValue="value" className="w-full h-11 rounded-md border border-gray-300 shadow-sm" panelClassName="rounded-xl" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Responsável *</label>
            <InputText value={form.responsible} onChange={(e) => handle('responsible', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Data da Manutenção</label>
            <input type="date" value={form.performedDate} onChange={(e) => handle('performedDate', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] text-gray-700" style={{ fontFamily: 'Poppins, sans-serif', colorScheme: 'light' }} />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Empresa responsável</label>
            <InputText value={form.company} onChange={(e) => handle('company', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">RC/OC *</label>
            <InputText value={form.rcOc} onChange={(e) => handle('rcOc', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea value={form.observacoes} onChange={(e) => handle('observacoes', e.target.value)} className="w-full min-h-[96px] rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084FF33]" />
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
    </>
  );
};

export default CreateMaintenance;
