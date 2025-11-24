// frontend/src/services/apiService.ts

// As declarações de tipo para import.meta.env já são fornecidas pelo Vite/TypeScript.
// Não é necessário redeclarar ImportMetaEnv ou ImportMeta.

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

  // 1. Define o tipo base para os cabeçalhos.
  // Usamos Record<string, string> ou HeadersInit para garantir que podemos adicionar chaves.
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 2. Mescla os headers existentes do objeto options
  if (options?.headers) {
    // Se options.headers for um objeto (Record<string, string>), mesclamos
    if (options.headers instanceof Headers) {
      // Se for uma instância nativa de Headers, convertemos para um objeto simples
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      // Se for um array de tuplas [chave, valor], processamos
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      // Se for um objeto Record<string, string>, mesclamos diretamente
      headers = { ...headers, ...(options.headers as Record<string, string>) };
    }
  }

  // ----------------------------------------------------------------
  // 3. Adiciona o cabeçalho Authorization com JWT
  // ----------------------------------------------------------------
  if (token) {
    // Agora o TypeScript sabe que 'headers' é um Record<string, string> e permite a chave
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Construir URL completa
  const baseUrl = getApiBaseUrl();
  const fullUrl = path.startsWith("/")
    ? `${baseUrl}${path}`
    : `${baseUrl}/${path}`;

  const res = await fetch(fullUrl, {
    ...options,
    // Passamos o objeto de headers atualizado
    headers: headers,
  });

  // ... (restante do código: tratamento de erros)
  if (!res.ok) {
    // Tenta ler JSON do corpo de erro, com fallback caso não seja JSON
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro na requisição." }));
    if (res.status === 401 || res.status === 403) {
      console.error("Sessão expirada ou não autorizada. Limpando token.");
      logout();
    }
    throw new Error(errorData.message || `Erro do servidor: ${res.status}`);
  }

  // Se não houver conteúdo (204 No Content) retornamos undefined
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  // Só chamar res.json() quando houver um body JSON para evitar
  // 'Unexpected end of JSON input' em respostas vazias
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // Tentar ler como texto e retornar texto vazio ou convertido
    const text = await res.text().catch(() => "");
    try {
      return (text ? JSON.parse(text) : ({} as T)) as T;
    } catch {
      return text as unknown as T;
    }
  }

  // Retorna os dados tipados como JSON
  return res.json() as Promise<T>;
}
