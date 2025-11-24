// frontend/src/services/apiService.ts

import { getToken, logout } from "./authService";

// ----------------------------------------------------------------
// Wrapper personalizado para requisições fetch com autenticação JWT
// ----------------------------------------------------------------

// Determinar a URL base da API
const getApiBaseUrl = (): string => {
  // Em desenvolvimento com proxy, usar /api
  if (import.meta.env.DEV) {
    return "/api";
  }
  // Em produção, usar a variável de ambiente ou padrão
  return import.meta.env.VITE_API_URL || "/api";
};

export async function authenticatedFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();

  // Define o tipo base para os cabeçalhos
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Mescla os headers existentes do objeto options
  if (options?.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      headers = { ...headers, ...(options.headers as Record<string, string>) };
    }
  }

  // Adiciona o cabeçalho Authorization com JWT
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Construir URL completa
  const baseUrl = getApiBaseUrl();
  const fullUrl = path.startsWith("/")
    ? `${baseUrl}${path}`
    : `${baseUrl}/${path}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: headers,
  });

  // Tratamento de erros
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro na requisição." }));

    if (res.status === 401 || res.status === 403) {
      console.error("Sessão expirada ou não autorizada. Limpando token.");
      logout();
    }

    throw new Error(errorData.message || `Erro do servidor: ${res.status}`);
  }

  // Se não houver conteúdo (204 No Content)
  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") || "";

  // Se for JSON → tratar como JSON
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  // Caso contrário → blob (Excel, PDF, imagem, etc)
  return res.blob() as any as T;
}
