import type { Maquina } from '../models/Maquina';
import type Manutencao from '../models/Manutencao';
import type { Alert, AlertUrgency } from '../models/Alert';

const parseDate = (date: string | Date | null): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  const [d, m, y] = date.split('/');
  return new Date(+y, +m - 1, +d);
};

const daysDiff = (from: Date, to: Date) => Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

const determineUrgency = (diff: number): { urgency: AlertUrgency; daysOverdue?: number; daysRemaining?: number } | null => {
  if (diff < 0) return { urgency: 'Vencida', daysOverdue: Math.abs(diff) };
  if (diff <= 7) return { urgency: 'Urgente', daysRemaining: diff };
  if (diff <= 30) return { urgency: 'Próxima', daysRemaining: diff };
  return null;
};

export const generateAlerts = (machines: (Maquina & { manutencoes?: Manutencao[] })[]): Alert[] => {
  const today = new Date();
  const alerts: Alert[] = [];

  machines.forEach((machine) => {
    const maintenanceTypes: { type: 'Manutenção Preventiva' | 'Calibração'; interval: number | undefined }[] = [
      { type: 'Manutenção Preventiva', interval: machine.intervaloManutencao },
      { type: 'Calibração', interval: machine.intervaloCalibracao },
    ];

    maintenanceTypes.forEach(({ type, interval }) => {
      if (!interval) return;

      // Última manutenção desse tipo
      const manutencoesDoTipo = machine.manutencoes?.filter(m => m.tipoManutencao === type) ?? [];
      let referenceDate = machine.dataAquisicao ? new Date(machine.dataAquisicao) : null;

      if (manutencoesDoTipo.length > 0) {
        const lastMaint = manutencoesDoTipo.reduce((prev, curr) => {
          return curr.dataProxima && (!prev || curr.dataProxima > prev) ? curr.dataProxima : prev;
        }, referenceDate);
        referenceDate = lastMaint ? new Date(lastMaint) : referenceDate;
      }

      if (!referenceDate) return;

      // Próxima data baseada no intervalo
      const nextDate = new Date(referenceDate);
      nextDate.setMonth(nextDate.getMonth() + interval);

      const diff = daysDiff(today, nextDate);
      const urgencyObj = determineUrgency(diff);
      if (!urgencyObj) return;

      alerts.push({
        id: `${machine.idMaquina}-${type}`,
        machineName: machine.nome,
        type,
        dueDate: `${String(nextDate.getDate()).padStart(2, '0')}/${String(nextDate.getMonth() + 1).padStart(2, '0')}/${nextDate.getFullYear()}`,
        urgency: urgencyObj.urgency,
        daysOverdue: urgencyObj.daysOverdue,
        daysRemaining: urgencyObj.daysRemaining,
      });
    });
  });

  return alerts;
};
