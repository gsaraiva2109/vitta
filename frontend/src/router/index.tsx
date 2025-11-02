import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../views/Home';
import Maquinas from '../views/Maquinas';
import Manutencoes from '../views/Manutencoes';
import Alertas from '../views/Alertas';
import Relatorios from '../views/Relatorios';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/maquinas" element={<Maquinas />} />
      <Route path="/manutencoes" element={<Manutencoes />} />
      <Route path="/alertas" element={<Alertas />} />
      <Route path="/relatorios" element={<Relatorios />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
