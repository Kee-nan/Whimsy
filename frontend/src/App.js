
import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//General Pages
import MainPage from './pages/main';
import Profile from './pages/profile';

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

        <Route path="/anime/:id" element={<AnimeDetail />} />  {/* Add route for anime detail */}
        <Route path="/manga/:id" element={<MangaDetail />} /> {/* Add the MangaDetail route */}
        <Route path="/shows/:id" element={<ShowDetail />} />
      </Routes>
    </Router>
  );
};

export default App;



