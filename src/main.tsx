import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Home from './pages/Home.tsx';

// Check device type once at load - mobile gets the new Home page, desktop gets the original
const isMobile = window.innerWidth < 768;

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(<StrictMode>{isMobile ? <Home /> : <App />}</StrictMode>);
