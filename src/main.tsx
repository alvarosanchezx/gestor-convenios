import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConveniosProvider } from './contexts/ConveniosContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ConveniosProvider>
        <App />
      </ConveniosProvider>
    </ThemeProvider>
  </StrictMode>
);
