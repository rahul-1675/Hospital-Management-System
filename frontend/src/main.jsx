import React from 'react';
import { createRoot } from 'react-dom/client';

// Import CSS Order Matters
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/dashboard.css';

import App from './app/App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
