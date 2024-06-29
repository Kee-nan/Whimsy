
import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/main';
import Profile from './pages/profile';
import Movies from './pages/movies';
import Anime from './pages/anime';
import Manga from './pages/manga';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/manga" element={<Manga />} />
      </Routes>
    </Router>
  );
};

export default App;



