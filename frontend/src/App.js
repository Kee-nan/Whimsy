// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// General Pages
import MainPage from './pages/main';
import Profile from './pages/profile';
import Lists from './pages/lists';
import LoginPage from './pages/login';
import CreateAccountPage from './pages/accountCreation';

// Search Pages
import Movies from './pages/searchs/movies';
import Anime from './pages/searchs/anime';
import Manga from './pages/searchs/manga';
import Albums from './pages/searchs/albums';
import Shows from './pages/searchs/shows';
import Books from './pages/searchs/books';

// Detail Pages
import AnimeDetail from './pages/details/animeDetails';
import MangaDetail from './pages/details/mangaDetails';
import ShowDetail from './pages/details/showDetails';
import AlbumDetail from './pages/details/albumDetails';
import BookDetail from './pages/details/bookDetails';
import MovieDetail from './pages/details/movieDetails';
import LeaveReview from './pages/leaveReview';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accountcreation" element={<CreateAccountPage />} />

        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lists" element={<Lists />} />
   
        <Route path="/movie" element={<Movies />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/manga" element={<Manga />} />
        <Route path="/album" element={<Albums />} />
        <Route path="/show" element={<Shows />} />
        <Route path="/book" element={<Books />} />

        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/manga/:id" element={<MangaDetail />} />
        <Route path="/show/:id" element={<ShowDetail />} />
        <Route path="/album/:id" element={<AlbumDetail />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/movie/:id" element={<MovieDetail />} />

        <Route path="/leaveReview" element={<LeaveReview />} />
      </Routes>
    </Router>
  );
};

export default App;




