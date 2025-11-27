import { Maquina, Manutencao } from "../models/index.js";
import { generateAlerts } from "../services/alertaService.js";
import { Op } from "sequelize";

export const getAlerts = async (req, res) => {
  try {
    const machines = await Maquina.findAll({
      include: [{ model: Manutencao, as: "manutencoes" }],
    });

    const alerts = generateAlerts(machines.map((m) => m.toJSON()));

    res.json(alerts);
  } catch (err) {
    console.error("Erro ao gerar alertas:", err);
    res.status(500).json({ message: "Erro ao carregar alertas" });
  }
};

