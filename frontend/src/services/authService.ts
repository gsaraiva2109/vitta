import type { LoginRequest, LoginResponse } from '../models/User';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Erro no login');
  const data = await res.json();
  // store token
  if (data.token) localStorage.setItem('vitta_token', data.token);
  return data as LoginResponse;
}

export function logout() {
  localStorage.removeItem('vitta_token');
}

export function getToken() {
  return localStorage.getItem('vitta_token');
}
