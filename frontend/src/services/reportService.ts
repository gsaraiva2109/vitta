import { authenticatedFetch } from "./apiService";

export async function exportarExcel(dados: Record<string, unknown>[]) {
  const blob = await authenticatedFetch<Blob>("/report/export/excel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
    responseType: 'blob'
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "relatorio.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

