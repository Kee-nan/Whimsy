import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/custom.css';
import App from './App'; // Adjust the path accordingly
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

