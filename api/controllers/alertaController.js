import Maquina from "../models/Maquina.js";
import Manutencao from "../models/Manutencao.js";
import { generateAlerts } from "../services/alertsService.js";

export const getAlerts = async (req, res) => {
  try {
    const machines = await Maquina.findAll({
      include: [{ model: Manutencao }],
    });

    const alerts = generateAlerts(machines);

    return res.json(alerts);
  } catch (err) {
    console.error("Erro ao gerar alertas:", err);
    return res.status(500).json({ error: "Erro ao gerar alertas" });
  }
};
