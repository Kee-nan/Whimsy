import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import Main from './pages/main'; // Adjust the path accordingly
import reportWebVitals from './reportWebVitals';

const root = (
  <React.StrictMode>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(root);

reportWebVitals();
