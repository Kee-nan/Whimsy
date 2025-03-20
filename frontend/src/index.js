import React from 'react';
import { createRoot } from 'react-dom/client';

// Every style sheet must be imported here to be implemented across the pages
import './index.css';
import './styles/custom.css';
import './styles/navbar.css';
import './styles/searchbar.css';
import './styles/mediacard.css';
import './styles/login.css';
import './styles/detailpage.css';
import './styles/list.css';
import './styles/homepage.css';
import './styles/review.css';
import './styles/profile.css';
import './styles/reviewcard.css';
import './styles/friend.css';


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

