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
    .map((m) => m.dataProxima)
    .filter(Boolean)
    .map(safeParseISO)
    .filter(Boolean);

  const acqDate = acquisitionDate ? safeParseISO(acquisitionDate) : null;
  const dates = acqDate ? [acqDate, ...maintenanceDates] : maintenanceDates;

  return dates.length > 0 ? max(dates) : null;
};

const createAlert = (machine, type, dueDate, urgencyDetails) => ({
  id: `${machine.idMaquina}-${type}`,
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
    allMaintenances?.filter((m) => m.tipoManutencao === type) ?? [];

  const referenceDate = getMostRecentMaintenanceDate(
    relevantMaintenances,
    machine.dataAquisicao
  );
  if (!referenceDate) return null;

  // Use addMonths for months, assuming interval is in months based on test failure context
  // The test expects months (3 months -> 90 days), but the code was doing days.
  // Reverting to addMonths to align with test expectations for now.
  const nextDueDate = addMonths(referenceDate, interval);
  const urgencyDetails = calculateUrgency(nextDueDate, today);
  if (!urgencyDetails) return null;

  return createAlert(machine, type, nextDueDate, urgencyDetails);
};

export const generateAlerts = (machines) => {
  const today = startOfDay(new Date());
  const alerts = [];

  machines.forEach((machine) => {
    const {
      intervaloManutencao,
      intervaloCalibracao,
      manutencoes,
    } = machine;

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
