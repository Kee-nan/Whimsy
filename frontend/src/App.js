
import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/main';
import Profile from './pages/profile';
import Movies from './pages/movies';
import Anime from './pages/anime';
import Manga from './pages/manga';
import Albums from './pages/albums';
import Shows from './pages/shows';
import Books from './pages/books';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/manga" element={<Manga />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </Router>
  );
};

export default App;



