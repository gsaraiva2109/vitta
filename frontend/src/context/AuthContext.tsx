import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { login as loginService, logout as logoutService, getToken } from '../services/authService';
import type { LoginRequest, LoginResponse, User } from '../models/User';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('vitta_token');
    const storedUser = localStorage.getItem('vitta_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        logoutService();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const response = await loginService(payload);
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutService();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login: handleLogin, logout: handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
