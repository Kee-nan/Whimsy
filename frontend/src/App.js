import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// General Pages
import MainPage from './pages/main';
import Profile from './pages/profile';
import Lists from './pages/lists';
import ViewFriendLists from './pages/viewFriendLists';
import Friend from './pages/friend';
import CustomLists from './pages/customLists';
import CustomListDetail from './pages/customListDetail';
import Global from './pages/global';

import LoginPage from './pages/login';
import CreateAccountPage from './pages/accountCreation';

// Search Pages
import SearchHub from './pages/searchHub';

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
        <Route path="/friend" element={<PrivateRoute element={<Friend />} />} />
        <Route path="/lists/:username/:id" element={<ViewFriendLists />} />
        <Route path="/global" element={<PrivateRoute element={<Global />} />} />

        <Route path="/lists/custom" element={<PrivateRoute element={<CustomLists />} />} />
        <Route path="/lists/custom/:listId" element={<PrivateRoute element={<CustomListDetail />} />} />

        <Route path="/search" element={<PrivateRoute element={<SearchHub />} />} />
        <Route path="/search/:mediaType" element={<PrivateRoute element={<SearchHub />} />} />
        

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





