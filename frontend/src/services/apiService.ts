// frontend/src/services/apiService.ts

import { getToken } from "./authService";

// ----------------------------------------------------------------
// Wrapper personalizado para requisições fetch com autenticação JWT
// ----------------------------------------------------------------
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
  // 3. CORREÇÃO DA LINHA 23: Adiciona o cabeçalho Authorization
  // ----------------------------------------------------------------
  if (token) {
    // Agora o TypeScript sabe que 'headers' é um Record<string, string> e permite a chave
    headers["Authorization"] = `Bearer ${token}`;
  }

  const rawApiUrl = import.meta.env.VITE_API_URL;
  if (!rawApiUrl) {
    throw new Error('VITE_API_URL não está definido. Defina em .env.local');
  }

  // Remove barras finais da URL base e garante que o path comece com '/'
  const apiUrl = String(rawApiUrl).replace(/\/+$/g, '');
  const endpoint = path.startsWith('/') ? path : `/${path}`;

  const res = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    // Passamos o objeto de headers atualizado
    headers: headers,
  });

  // ... (restante do código: tratamento de erros)
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro na requisição." }));
    if (res.status === 401 || res.status === 403) {
      console.error("Sessão expirada ou não autorizada. Limpando token.");
    }
    throw new Error(errorData.message || `Erro do servidor: ${res.status}`);
  }

  // Retorna os dados tipados
  return res.json() as Promise<T>;
}
