import type { LoginRequest, LoginResponse } from '../models/User';

// Determinar a URL base da API
const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return '/api';
  }
  return import.meta.env.VITE_API_URL || '/api';
};

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/auth/login`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Erro no login');
  const data = await res.json();
  // store token and user data
  if (data.token) {
    localStorage.setItem('vitta_token', data.token);
    localStorage.setItem('vitta_user', JSON.stringify(data.user));
  }
  return data as LoginResponse;
}

export function logout() {
  localStorage.removeItem('vitta_token');
}

export function getToken() {
  return localStorage.getItem('vitta_token');
}
