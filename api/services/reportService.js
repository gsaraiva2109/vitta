import ExcelJS from "exceljs";

export async function gerarExcelRelatorio(dados) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Relatório");

  worksheet.addRow([
    "Código",
    "Patrimônio",
    "Nome",
    "Função",
    "Data Aquisição",
    "Fabricante",
    "Modelo",
    "Número",
    "Localização",
    "Status",
    "Observações",
  ]);

  dados.forEach((item) => {
    worksheet.addRow([
      item.codigo,
      item.patrimonio,
      item.nome,
      item.funcao,
      item.dataAquisicao,
      item.fabricante,
      item.modelo,
      item.numero,
      item.localizacao,
      item.status,
      item.observacoes,
    ]);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
