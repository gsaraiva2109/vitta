import { loadMaintenancesFromAPI } from './maintenancesApiController';
import type { Alert } from '../models/Alert';
import { parse, differenceInDays, startOfDay, isValid } from 'date-fns';

// Helper to parse dd/mm/yyyy
const parseBrDate = (dateStr: string): Date | null => {
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed : null;
};

export async function getAlerts(): Promise<Alert[]> {
    const maintenances = await loadMaintenancesFromAPI();
    const today = startOfDay(new Date());
    const alerts: Alert[] = [];

    maintenances.forEach((m) => {
        if (!m.dataProxima) return;

        const dueDate = parseBrDate(m.dataProxima);
        if (!dueDate) return;

        const diff = differenceInDays(dueDate, today);

        let urgency: 'Vencida' | 'Urgente' | 'Próxima' | null = null;

        if (diff < 0) {
            urgency = 'Vencida';
        } else if (diff <= 7) {
            urgency = 'Urgente';
        } else if (diff <= 30) {
            urgency = 'Próxima';
        }

        if (urgency) {
            alerts.push({
                id: m.id,
                machineName: m.machineName || 'Máquina Desconhecida',
                type: m.tipoManutencao || 'Manutenção',
                dueDate: m.dataProxima,
                urgency: urgency,
                daysOverdue: diff < 0 ? Math.abs(diff) : undefined,
                daysRemaining: diff >= 0 ? diff : undefined
            });
        }
    });

    // Sort alerts: Vencida first, then Urgente, then Próxima
    alerts.sort((a, b) => {
        const urgencyOrder: { [key: string]: number } = { 'Vencida': 0, 'Urgente': 1, 'Próxima': 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        // If same urgency
        if (a.urgency === 'Vencida') {
            // More overdue first
            return (b.daysOverdue || 0) - (a.daysOverdue || 0);
        } else {
            // Less remaining first
            return (a.daysRemaining || 0) - (b.daysRemaining || 0);
        }
    });

    return alerts;
}
