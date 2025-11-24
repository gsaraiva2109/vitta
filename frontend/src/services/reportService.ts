import { authenticatedFetch } from "./apiService";

export async function exportarExcel(dados: any[]) {
  const response = await authenticatedFetch<Blob>("/report/export/excel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const blob = new Blob([response as any], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "relatorio.xlsx");
  document.body.appendChild(link);
  link.click();
}
