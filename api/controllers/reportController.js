import { gerarExcelRelatorio } from "../services/reportService.js";

export const exportarExcelController = async (req, res) => {
  try {
    const dados = req.body;

    const excelBuffer = await gerarExcelRelatorio(dados);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.xlsx");

    return res.send(excelBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao gerar Excel" });
  }
};
