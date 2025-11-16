import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../views/Home';
import Login from '../views/Login';
import Maquinas from '../views/Maquinas';
import Manutencoes from '../views/Manutencoes';
import Alertas from '../views/Alertas';
import Relatorios from '../views/Relatorios';
import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}> {/* Protected routes wrapper */}
        <Route path="/" element={<Home />} />
        <Route path="/maquinas" element={<Maquinas />} />
        <Route path="/manutencoes" element={<Manutencoes />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Route>
      {/* Optionally, add a route for 404 Not Found */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  </BrowserRouter>
);

export default AppRouter;

export default AppRouter;
