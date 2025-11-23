import type { Machine } from '../models/Machine';
import type { Alert, AlertUrgency } from '../models/Alert';

// Converte dd/mm/aaaa para Date
const parseDate = (br: string): Date | null => {
  if (!br) return null;
  const [d, m, y] = br.split('/');
  if (!d || !m || !y) return null;
  return new Date(+y, +m - 1, +d);
};

// Retorna diferença em dias (positivo = futuro, negativo = passado)
const daysDiff = (from: Date, to: Date) => {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

export const generateAlerts = (machines: Machine[]): Alert[] => {
  const today = new Date();
  const alerts: Alert[] = [];

  machines.forEach((m) => {
    if (m.maintenanceInterval && m.acquisitionDate) {
      const acquired = parseDate(m.acquisitionDate);
      if (acquired) {
        const interval = +m.maintenanceInterval;
        const nextMaint = new Date(acquired);
        nextMaint.setMonth(nextMaint.getMonth() + interval);
        const diff = daysDiff(today, nextMaint);

        let urgency: AlertUrgency;
        let daysOverdue: number | undefined;
        let daysRemaining: number | undefined;

        if (diff < 0) {
          urgency = 'Vencida';
          daysOverdue = Math.abs(diff);
        } else if (diff <= 7) {
          urgency = 'Urgente';
          daysRemaining = diff;
        } else if (diff <= 30) {
          urgency = 'Próxima';
          daysRemaining = diff;
        } else {
          return; // ignora se >30 dias
        }

        alerts.push({
          id: `${m.id}-maint`,
          machineName: m.nome,
          type: 'Manutenção Preventiva',
          dueDate: `${String(nextMaint.getDate()).padStart(2, '0')}/${String(nextMaint.getMonth() + 1).padStart(2, '0')}/${nextMaint.getFullYear()}`,
          urgency,
          daysOverdue,
          daysRemaining,
        });
      }
    }

    if (m.calibrationInterval && m.acquisitionDate) {
      const acquired = parseDate(m.acquisitionDate);
      if (acquired) {
        const interval = +m.calibrationInterval;
        const nextCal = new Date(acquired);
        nextCal.setMonth(nextCal.getMonth() + interval);
        const diff = daysDiff(today, nextCal);

        let urgency: AlertUrgency;
        let daysOverdue: number | undefined;
        let daysRemaining: number | undefined;

        if (diff < 0) {
          urgency = 'Vencida';
          daysOverdue = Math.abs(diff);
        } else if (diff <= 7) {
          urgency = 'Urgente';
          daysRemaining = diff;
        } else if (diff <= 30) {
          urgency = 'Próxima';
          daysRemaining = diff;
        } else {
          return;
        }

        alerts.push({
          id: `${m.id}-calib`,
          machineName: m.nome,
          type: 'Calibração',
          dueDate: `${String(nextCal.getDate()).padStart(2, '0')}/${String(nextCal.getMonth() + 1).padStart(2, '0')}/${nextCal.getFullYear()}`,
          urgency,
          daysOverdue,
          daysRemaining,
        });
      }
    }
  });

  return alerts;
};
