import type { LoginRequest, LoginResponse } from '../models/User';
import { jwtDecode } from 'jwt-decode';


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
  // store token
  if (data.token) localStorage.setItem('vitta_token', data.token);
  if (data.user) localStorage.setItem('vitta_user', JSON.stringify(data.user));
  return data as LoginResponse;
}

export function logout() {
  localStorage.removeItem('vitta_token');
  localStorage.removeItem('vitta_user');
}

export function getToken() {
  return localStorage.getItem('vitta_token');
}

export function getUser() {
  const u = localStorage.getItem('vitta_user');
  return u ? JSON.parse(u) : null;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decodedToken.exp)
      return decodedToken.exp < currentTime;
    
    return true
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}
