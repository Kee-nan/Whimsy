
import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//General Pages
import MainPage from './pages/main';
import Profile from './pages/profile';
import Lists from './pages/lists';

//Search Pages
import Movies from './pages/searchs/movies';
import Anime from './pages/searchs/anime';
import Manga from './pages/searchs/manga';
import Albums from './pages/searchs/albums';
import Shows from './pages/searchs/shows';
import Books from './pages/searchs/books';

//Detail Pages
import AnimeDetail from './pages/details/animeDetails';  // Import the new detail page component
import MangaDetail from './pages/details/mangaDetails'; // Import the MangaDetail component
import ShowDetail from './pages/details/showDetails';
import AlbumDetail from './pages/details/albumDetails';
import BookDetail from './pages/details/bookDetails';
import MovieDetail from './pages/details/movieDetails';
import LeaveReview from './pages/leaveReview';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lists" element={<Lists />} />
      
        <Route path="/movies" element={<Movies />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/manga" element={<Manga />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/books" element={<Books />} />

        <Route path="/anime/:id" element={<AnimeDetail />} />  {/* Add route for anime detail */}
        <Route path="/manga/:id" element={<MangaDetail />} /> {/* Add the MangaDetail route */}
        <Route path="/shows/:id" element={<ShowDetail />} />
        <Route path="/albums/:id" element={<AlbumDetail />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/movies/:id" element={<MovieDetail />} />

        <Route path="/leaveReview" element={<LeaveReview />} />
      </Routes>
    </Router>
  );
};

export default App;



