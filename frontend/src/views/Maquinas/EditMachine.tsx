import { useState, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast, showToast, ToastMessages } from '../../components/CustomToast';
import type { Machine } from '../../models/Machine';
import { brToISO, isoToBR } from '../../controllers/machinesController';

interface Props {
  machine: Machine;
  onCancel: () => void;
  onSubmit: (data: Machine) => void;
}

const EditMachine = ({ machine, onCancel, onSubmit }: Props) => {
  const toast = useRef<Toast>(null);
  const [form, setForm] = useState<Machine>(machine);
  const [showJustificativaDialog, setShowJustificativaDialog] = useState(false);
  const [tempJustificativa, setTempJustificativa] = useState('');
  const acquisitionISO = useMemo(() => brToISO(form.acquisitionDate), [form.acquisitionDate]);

  const handle = (k: keyof Machine, v: string) => {
    if (k === 'status' && v === 'Inativo') {
      setTempJustificativa(form.justificativaInativo || '');
      setShowJustificativaDialog(true);
      return;
    }
    if (k === 'status' && v !== 'Inativo' && form.status === 'Inativo') {
      setForm(prev => ({ ...prev, [k]: v, justificativaInativo: '' }));
      return;
    }
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const handleSaveJustificativa = () => {
    if (!tempJustificativa.trim()) {
      showToast(toast, ToastMessages.justificativa.required);
      return;
    }
    setForm(prev => ({ ...prev, status: 'Inativo', justificativaInativo: tempJustificativa }));
    setShowJustificativaDialog(false);
    showToast(toast, ToastMessages.justificativa.saved);
  };

  const handleCancelJustificativa = () => {
    setShowJustificativaDialog(false);
    setTempJustificativa('');
    showToast(toast, ToastMessages.justificativa.cancelled);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof Machine)[] = ['name', 'patrimony', 'funcao', 'acquisitionDate', 'serialNumber'];
    if (required.some(f => !form[f])) {
      showToast(toast, ToastMessages.validation.requiredFields);
      return;
    }
    
    if (form.status === 'Inativo' && !form.justificativaInativo?.trim()) {
      showToast(toast, ToastMessages.justificativa.missing);
      setTempJustificativa('');
      setShowJustificativaDialog(true);
      return;
    }
    
    showToast(toast, ToastMessages.maquina.updated);
    onSubmit(form);
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      
      <Dialog
        visible={showJustificativaDialog}
        onHide={handleCancelJustificativa}
        style={{ width: '540px', borderRadius: '12px', overflow: 'hidden' }}
        showCloseIcon={false}
        closeOnEscape={true}
        resizable={false}
        modal
        draggable={false}
        pt={{
          root: { className: 'rounded-xl overflow-hidden' },
          content: { className: 'p-0 rounded-xl' }
        }}
      >
        <div className="flex flex-col gap-4 px-6 py-6">
          <label className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Justificativa *
          </label>
          <textarea
            value={tempJustificativa}
            onChange={(e) => setTempJustificativa(e.target.value)}
            placeholder="Informe a justificativa para inativar esta máquina"
            className="w-full min-h-[120px] rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] resize-none"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
          <div className="flex justify-end gap-3">
            <Button
              label="Cancelar"
              onClick={handleCancelJustificativa}
              className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
            />
            <Button
              label="Salvar"
              onClick={handleSaveJustificativa}
              className="px-6 py-2 rounded-lg bg-[#0084FF] text-white hover:bg-[#0073E6]"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            />
          </div>
        </div>
      </Dialog>

    <form onSubmit={submit} className="flex flex-col">
      <header className="px-8 pt-8 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
          Editar Máquina
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
            <InputText value={form.maintenanceInterval || ''} onChange={(e) => handle('maintenanceInterval', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Data de Aquisição *</label>
            <input type="date" value={acquisitionISO} onChange={(e) => handle('acquisitionDate', isoToBR(e.target.value))} className="w-full h-11 rounded-md border border-gray-300 shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] text-gray-700" style={{ fontFamily: 'Poppins, sans-serif', colorScheme: 'light' }} />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Intervalo entre Calibrações (em meses)</label>
            <InputText value={form.calibrationInterval || ''} onChange={(e) => handle('calibrationInterval', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Número de Série *</label>
            <InputText value={form.serialNumber || ''} onChange={(e) => handle('serialNumber', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
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
            <InputText value={form.modelo || ''} onChange={(e) => handle('modelo', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">RC/OC</label>
            <InputText value={form.rcOc || ''} onChange={(e) => handle('rcOc', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Localização</label>
            <InputText value={form.location} onChange={(e) => handle('location', e.target.value)} className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#0084FF33]" />
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea value={form.observacoes || ''} onChange={(e) => handle('observacoes', e.target.value)} className="w-full min-h-[96px] rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084FF33] resize-none" />
          </div>
        </div>
      </div>

      <footer className="flex justify-end gap-4 border-t border-gray-200 px-8 py-5">
        <button type="button" onClick={onCancel} className="h-11 rounded-xl bg-[#F4F4F4] px-6 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-[#0084FF33]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
          Cancelar
        </button>
        <button type="submit" className="h-11 rounded-xl bg-[#0084FF] px-7 text-white hover:bg-[#0073E6] focus:outline-none focus:ring-4 focus:ring-[#0084FF33]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
          Atualizar
        </button>
      </footer>
    </form>
    </>
  );
};

export default EditMachine;
