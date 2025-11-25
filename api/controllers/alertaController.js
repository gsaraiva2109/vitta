import Maquina from "../models/Maquina.js";
import Manutencao from "../models/Manutencao.js";
import { generateAlerts } from "../services/alertaService.js";


export const getAlerts = async (req, res) => {
  try {
    const machines = await Maquina.findAll({
      include: [{ model: Manutencao, as: 'manutencoes' }],
    });

    const alerts = generateAlerts(
      machines.map(m => m.toJSON())
    );

    res.json(alerts);
  } catch (err) {
    console.error('Erro ao gerar alertas:', err);
    res.status(500).json({ message: 'Erro ao carregar alertas' });
  }
};
