export type AlertUrgency = 'Vencida' | 'Urgente' | 'Próxima';

export interface Alert {
  id: string;
  machineName: string;
  type: string; // ex: 'Manutenção Preventiva', 'Calibração'
  dueDate: string; // dd/mm/aaaa
  urgency: AlertUrgency;
  daysOverdue?: number; // só para Vencidas
  daysRemaining?: number; // só para Urgente/Próxima
}
