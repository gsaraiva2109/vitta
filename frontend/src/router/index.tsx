import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../views/Home';
import Login from '../views/Login';
import Maquinas from '../views/Maquinas';
import Manutencoes from '../views/Manutencoes';
import Alertas from '../views/Alertas';
import Relatorios from '../views/Relatorios';
import { getToken, isTokenExpired } from '../services/authService';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }

  return children as React.ReactElement;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/maquinas" element={<PrivateRoute><Maquinas /></PrivateRoute>} />
      <Route path="/manutencoes" element={<PrivateRoute><Manutencoes /></PrivateRoute>} />
      <Route path="/alertas" element={<PrivateRoute><Alertas /></PrivateRoute>} />
      <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
);



export default AppRouter;
