import { useEffect } from 'react';
import type { Machine } from '../../models/Machine';

interface Props {
  machine: Machine;
  onClose: () => void;
}

const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="text-[15px] text-gray-800">
    <span className="font-semibold">{label}: </span>
    <span className="font-normal">{value || '—'}</span>
  </div>
);

const ViewMachine = ({ machine, onClose }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[920px] rounded-2xl bg-white shadow-2xl">
        {/* Botão fechar (canto superior direito) */}
        <button
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          <i className="pi pi-times text-base" />
        </button>

        {/* Cabeçalho */}
        <div className="px-8 pt-8 pb-4">
          <h2
            className="text-[20px] font-semibold text-gray-900"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
          >
            {machine.name}
          </h2>
        </div>

        {/* Conteúdo */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            <Row label="Data de Aquisição" value={machine.acquisitionDate} />
            <Row label="Patrimônio" value={machine.patrimony} />

            <Row label="Função" value={machine.funcao} />
            <Row label="Status" value={machine.status} />

            <Row label="Número de série" value={machine.serialNumber} />
            <Row label="RC/OC" value={machine.rcOc} />

            <Row label="Fabricante" value={machine.fabricante} />
            <Row label="Modelo" value={machine.modelo} />

            <Row label="Localização" value={machine.location} />
            <Row
              label="Intervalo entre manutenções"
              value={machine.maintenanceInterval ? `${machine.maintenanceInterval} meses` : undefined}
            />

            <Row
              label="Intervalo entre calibrações"
              value={machine.calibrationInterval ? `${machine.calibrationInterval} meses` : undefined}
            />

            {/* Observações em largura total */}
            <div className="md:col-span-2">
              <Row label="Observações" value={machine.observacoes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMachine;
