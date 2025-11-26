import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import {
  generateAlerts,
  getMostRecentMaintenanceDate,
  calculateUrgency,
} from "./alertaService.js";
import { parseISO, startOfDay } from "date-fns";

describe("generateAlerts", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-08-26T00:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should generate alerts that match the snapshot", () => {
    const machines = [
      {
        idMaquina: 1,
        nome: "Machine A",
        dataAquisicao: "2023-01-01T00:00:00.000Z",
        intervaloManutencao: 3, // 3 months
        intervaloCalibracao: 6, // 6 months
        manutencoes: [
          {
            tipoManutencao: "Manutenção Preventiva",
            dataProxima: "2023-04-01T00:00:00.000Z",
          },
        ],
      },
      {
        idMaquina: 2,
        nome: "Machine B",
        dataAquisicao: "2023-01-01T00:00:00.000Z",
        intervaloManutencao: 2, // 2 months
        intervaloCalibracao: null, // No calibration
      },
      {
        idMaquina: 3,
        nome: "Machine C",
        dataAquisicao: "2024-10-01T00:00:00.000Z",
        intervaloManutencao: 12,
        intervaloCalibracao: 12,
      },
      {
        idMaquina: 4,
        nome: "Machine D",
        dataAquisicao: "2024-11-20T00:00:00.000Z",
        intervaloManutencao: 1,
        intervaloCalibracao: 1,
      },
    ];

    const alerts = generateAlerts(machines);
    expect(alerts).toEqual([
      {
        "id": "1-Preventiva",
        "machineName": "Machine A",
        "type": "Preventiva",
        "dueDate": "31/03/2023",
        "urgency": "Vencida",
        "daysOverdue": 877
      },
      {
        "id": "1-Calibracao",
        "machineName": "Machine A",
        "type": "Calibracao",
        "dueDate": "30/06/2023",
        "urgency": "Vencida",
        "daysOverdue": 786
      },
      {
        "id": "2-Preventiva",
        "machineName": "Machine B",
        "type": "Preventiva",
        "dueDate": "28/02/2023",
        "urgency": "Vencida",
        "daysOverdue": 908
      },
      {
        "id": "4-Preventiva",
        "machineName": "Machine D",
        "type": "Preventiva",
        "dueDate": "19/12/2024",
        "urgency": "Vencida",
        "daysOverdue": 248
      },
      {
        "id": "4-Calibracao",
        "machineName": "Machine D",
        "type": "Calibracao",
        "dueDate": "19/12/2024",
        "urgency": "Vencida",
        "daysOverdue": 248
      }
    ]);
  });
});

describe("getMostRecentMaintenanceDate", () => {
  it("should return the acquisition date if no maintenance dates are provided", () => {
    const maintenances = [];
    const acquisitionDate = "2023-01-01T00:00:00.000Z";
    const result = getMostRecentMaintenanceDate(maintenances, acquisitionDate);
    expect(result).toEqual(parseISO(acquisitionDate));
  });

  it("should return the most recent maintenance date", () => {
    const maintenances = [
      { dataProxima: "2023-03-01T00:00:00.000Z" },
      { dataProxima: "2023-05-01T00:00:00.000Z" },
    ];
    const acquisitionDate = "2023-01-01T00:00:00.000Z";
    const result = getMostRecentMaintenanceDate(maintenances, acquisitionDate);
    expect(result).toEqual(parseISO("2023-05-01T00:00:00.000Z"));
  });

  it("should return null if no dates are available", () => {
    const maintenances = [];
    const acquisitionDate = null;
    const result = getMostRecentMaintenanceDate(maintenances, acquisitionDate);
    expect(result).toBeNull();
  });
});

describe("calculateUrgency", () => {
  const today = startOfDay(new Date("2024-01-15T00:00:00.000Z"));

  it('should return "Vencida" for past dates', () => {
    const dueDate = new Date("2024-01-10T00:00:00.000Z");
    const result = calculateUrgency(dueDate, today);
    expect(result).toEqual({ urgency: "Vencida", daysOverdue: 4 });
  });

  it('should return "Urgente" for dates within 7 days', () => {
    const dueDate = new Date("2024-01-20T00:00:00.000Z");
    const result = calculateUrgency(dueDate, today);
    expect(result).toEqual({ urgency: "Urgente", daysRemaining: 5 });
  });

  it('should return "Próxima" for dates within 30 days', () => {
    const dueDate = new Date("2024-02-10T00:00:00.000Z");
    const result = calculateUrgency(dueDate, today);
    expect(result).toEqual({ urgency: "Próxima", daysRemaining: 26 });
  });

  it("should return null for dates more than 30 days away", () => {
    const dueDate = new Date("2024-03-01T00:00:00.000Z");
    const result = calculateUrgency(dueDate, today);
    expect(result).toBeNull();
  });
});

