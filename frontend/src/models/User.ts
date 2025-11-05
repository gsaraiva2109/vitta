export interface LoginRequest {
  matricula: string;
  senha: string;
}

export interface User {
  id: number;
  matricula: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
