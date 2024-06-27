import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'; // Adjust the path accordingly
import reportWebVitals from './reportWebVitals';

const root = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(root);

reportWebVitals();

