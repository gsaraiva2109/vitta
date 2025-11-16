export interface LoginRequest {
  matricula: string;
  senha: string;
}

export interface User {
  id: number;
  matricula: string;
  tipo: 'user' | 'manager';
}

export interface LoginResponse {
  token: string;
  user: User;
}
