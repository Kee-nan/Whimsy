import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

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
import Games from './pages/searchs/games';

// Detail Pages
import AnimeDetail from './pages/details/animeDetails';
import MangaDetail from './pages/details/mangaDetails';
import ShowDetail from './pages/details/showDetails';
import AlbumDetail from './pages/details/albumDetails';
import BookDetail from './pages/details/bookDetails';
import MovieDetail from './pages/details/movieDetails';
import GameDetail from './pages/details/gameDetails';


import LeaveReview from './pages/leaveReview';

import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/accountcreation" element={<CreateAccountPage />} />

        <Route path="/homepage" element={<PrivateRoute element={<MainPage />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/lists" element={<PrivateRoute element={<Lists />} />} />

        <Route path="/movie" element={<PrivateRoute element={<Movies />} />} />
        <Route path="/anime" element={<PrivateRoute element={<Anime />} />} />
        <Route path="/manga" element={<PrivateRoute element={<Manga />} />} />
        <Route path="/album" element={<PrivateRoute element={<Albums />} />} />
        <Route path="/show" element={<PrivateRoute element={<Shows />} />} />
        <Route path="/book" element={<PrivateRoute element={<Books />} />} />
        <Route path="/game" element={<PrivateRoute element={<Games />} />} />

        <Route path="/anime/:id" element={<PrivateRoute element={<AnimeDetail />} />} />
        <Route path="/manga/:id" element={<PrivateRoute element={<MangaDetail />} />} />
        <Route path="/show/:id" element={<PrivateRoute element={<ShowDetail />} />} />
        <Route path="/album/:id" element={<PrivateRoute element={<AlbumDetail />} />} />
        <Route path="/book/:id" element={<PrivateRoute element={<BookDetail />} />} />
        <Route path="/movie/:id" element={<PrivateRoute element={<MovieDetail />} />} />
        <Route path="/game/:id" element={<PrivateRoute element={<GameDetail />} />} />
        
        <Route path="/leaveReview" element={<PrivateRoute element={<LeaveReview />} />} />
      </Routes>
    </Router>
  );
};

export default App;





