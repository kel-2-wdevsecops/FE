import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from './app/App';
import { queryClient } from './app/queryClient';
import { ToastProvider } from './components/feedback/ToastProvider';
import { ConfirmModal } from './components/ui/ConfirmModal';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <ToastProvider />
        <ConfirmModal />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
