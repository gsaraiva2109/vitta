import { getToken, logout } from "./authService";

const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return "/api";
  }
  return import.meta.env.VITE_API_URL || "/api";
};

export async function authenticatedFetch<T>(
  path: string,
  options?: RequestInit & { responseType?: 'json' | 'blob' }
): Promise<T> {
  const token = getToken();

  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

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

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const fullUrl = path.startsWith("/")
    ? `${baseUrl}${path}`
    : `${baseUrl}/${path}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: headers,
  });

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

  if (options?.responseType === 'blob') {
    return res.blob() as Promise<T>;
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    try {
      return (text ? JSON.parse(text) : ({} as T)) as T;
    } catch {
      return text as unknown as T;
    }
  }

  return res.json() as Promise<T>;
}
