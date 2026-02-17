import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './firebase/firebase.ts';
import { registerNotificationServiceWorker } from './services/prayerTimeService';

void registerNotificationServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
