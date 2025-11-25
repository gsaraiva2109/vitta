

const daysDiff = (from, to) => {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
};

const determineUrgency = (diff) => {
  if (diff < 0) return { urgency: "Vencida", daysOverdue: Math.abs(diff) };
  if (diff <= 7) return { urgency: "Urgente", daysRemaining: diff };
  if (diff <= 30) return { urgency: "Próxima", daysRemaining: diff };
  return null;
};

// FUNÇÃO PRINCIPAL
export const generateAlerts = (machines) => {
  const today = new Date();
  const alerts = [];

  machines.forEach((machine) => {
    const maintenanceTypes = [
      { type: "Manutenção Preventiva", interval: machine.intervaloManutencao },
      { type: "Calibração", interval: machine.intervaloCalibracao },
    ];

    maintenanceTypes.forEach(({ type, interval }) => {
      if (!interval) return;

      // acha as manutenções daquele tipo para a máquina
      const manutencoesDoTipo =
        machine.manutencoes?.filter((m) => m.tipoManutencao === type) ?? [];

      let referenceDate = machine.dataAquisicao
        ? new Date(machine.dataAquisicao)
        : null;

      // se existe manutenção, pega a última dataProxima válida
      if (manutencoesDoTipo.length > 0) {
        const lastDate = manutencoesDoTipo.reduce((prev, curr) => {
          if (curr.dataProxima && (!prev || curr.dataProxima > prev)) {
            return curr.dataProxima;
          }
          return prev;
        }, referenceDate);

        referenceDate = lastDate ? new Date(lastDate) : referenceDate;
      }

      if (!referenceDate) return;

      // calcula próxima data com base no intervalo da máquina
      const nextDate = new Date(referenceDate);
      nextDate.setMonth(nextDate.getMonth() + interval);

      const diff = daysDiff(today, nextDate);
      const urgencyObj = determineUrgency(diff);
      if (!urgencyObj) return;

      alerts.push({
        id: `${machine.idMaquina}-${type}`,
        machineName: machine.nome,
        type,
        dueDate:
          String(nextDate.getDate()).padStart(2, "0") +
          "/" +
          String(nextDate.getMonth() + 1).padStart(2, "0") +
          "/" +
          nextDate.getFullYear(),
        urgency: urgencyObj.urgency,
        daysOverdue: urgencyObj.daysOverdue,
        daysRemaining: urgencyObj.daysRemaining,
      });
    });
  });

  return alerts;
};
