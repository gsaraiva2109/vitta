import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import './index.css'
import AppRouter from './router'

import 'primereact/resources/themes/lara-light-blue/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <AppRouter />
    </PrimeReactProvider>
  </StrictMode>,
)
