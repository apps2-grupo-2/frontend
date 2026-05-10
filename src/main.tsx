import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { TanstackQueryProvider } from '@/providers/tanstack-query-provider';
import { App } from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TanstackQueryProvider>
        <App />
      </TanstackQueryProvider>
    </BrowserRouter>
  </StrictMode>
);