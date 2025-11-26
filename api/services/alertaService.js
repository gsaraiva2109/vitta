import {
  differenceInDays,
  addDays,
  addMonths,
  format,
  parseISO,
  max,
  startOfDay,
} from "date-fns";

const MAINTENANCE_TYPES = {
  PREVENTIVA: "Preventiva",
  CALIBRACAO: "Calibracao",
};

const URGENCY_LEVELS = {
  VENCIDA: "Vencida",
  URGENTE: "Urgente",
  PROXIMA: "Próxima",
};

export const calculateUrgency = (dueDate, today) => {
  const diff = differenceInDays(dueDate, today);

  if (diff < 0) {
    return {
      urgency: URGENCY_LEVELS.VENCIDA,
      daysOverdue: Math.abs(diff),
    };
  }
  if (diff <= 7) {
    return { urgency: URGENCY_LEVELS.URGENTE, daysRemaining: diff };
  }
  if (diff <= 30) {
    return { urgency: URGENCY_LEVELS.PROXIMA, daysRemaining: diff };
  }
  return null;
};

const safeParseISO = (date) => {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string') {
    return parseISO(date);
  }
  return null;
};

export const getMostRecentMaintenanceDate = (maintenances, acquisitionDate) => {
  const maintenanceDates = maintenances
    .map((m) => {
      // Prefer dataProxima if available (predictive chain), otherwise use dataManutencao (performed date)
      const date = m.dataProxima || m.dataManutencao;
      return safeParseISO(date);
    })
    .filter(Boolean);

  const acqDate = acquisitionDate ? safeParseISO(acquisitionDate) : null;
  const dates = acqDate ? [acqDate, ...maintenanceDates] : maintenanceDates;

  return dates.length > 0 ? max(dates) : null;
};

const createAlert = (machine, type, dueDate, urgencyDetails, isScheduled = false) => ({
  id: isScheduled ? `${machine.idMaquina}-${type}-${dueDate.getTime()}` : `${machine.idMaquina}-${type}`,
  machineName: machine.nome,
  type,
  dueDate: format(dueDate, "dd/MM/yyyy"),
  ...urgencyDetails,
});

const processMaintenanceType = (
  machine,
  type,
  interval,
  today,
  allMaintenances
) => {
  if (!interval) return null;

  const relevantMaintenances =
    allMaintenances?.filter((m) => m.tipoManutencao === type && m.status === 'Concluída') ?? [];

  const referenceDate = getMostRecentMaintenanceDate(
    relevantMaintenances,
    machine.dataAquisicao
  );
  if (!referenceDate) return null;

  const nextDueDate = addMonths(referenceDate, interval);
  const urgencyDetails = calculateUrgency(nextDueDate, today);
  if (!urgencyDetails) return null;

  return createAlert(machine, type, nextDueDate, urgencyDetails);
};

const processScheduledMaintenances = (machine, today) => {
  const alerts = [];
  // Strictly define active statuses. 'Concluída', 'Cancelada', 'Descartado' are ignored.
  const activeStatuses = ['Em andamento', 'Pendente', 'Agendada']; 
  
  const openMaintenances = machine.manutencoes?.filter(m => 
    m.status && activeStatuses.includes(m.status.trim())
  ) || [];

  openMaintenances.forEach(m => {
      const dueDate = safeParseISO(m.dataManutencao);
      if (!dueDate) return;

      const urgencyDetails = calculateUrgency(dueDate, today);
      if (urgencyDetails) {
           const type = m.tipoManutencao || 'Manutenção';
           // Create alert for the scheduled task
           alerts.push(createAlert(machine, type, dueDate, urgencyDetails, true));
      }
  });
  return alerts;
}

export const generateAlerts = (machines) => {
  const today = startOfDay(new Date());
  const alerts = [];

  machines.forEach((machine) => {
    const {
      intervaloManutencao,
      intervaloCalibracao,
      manutencoes,
    } = machine;

    // 1. Process Scheduled/Open Tasks (Active Maintenances)
    const scheduledAlerts = processScheduledMaintenances(machine, today);
    alerts.push(...scheduledAlerts);

    // 2. Process Predictive Alerts (Based on Intervals)
    const preventiveAlert = processMaintenanceType(
      machine,
      MAINTENANCE_TYPES.PREVENTIVA,
      intervaloManutencao,
      today,
      manutencoes
    );
    if (preventiveAlert) alerts.push(preventiveAlert);

    const calibrationAlert = processMaintenanceType(
      machine,
      MAINTENANCE_TYPES.CALIBRACAO,
      intervaloCalibracao,
      today,
      manutencoes
    );
    if (calibrationAlert) alerts.push(calibrationAlert);
  });

  return alerts;
};
