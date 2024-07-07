import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Anime = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKey, setSearchKey] = useState(location.state?.searchKey || "");
  const [anime, setAnime] = useState(location.state?.searchResults || []);

  useEffect(() => {
    if (location.state?.searchKey) {
      searchAnime(location.state.searchKey);
    }
  }, [location.state]);

  const searchAnime = async (key) => {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: { q: key, sfw: true }
      });
      setAnime(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Anime:", error);
      setAnime([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchAnime(searchKey);
  };

  const clearAnime = () => {
    setAnime([]);
  };

  const handleCardClick = (id) => {
    const currentState = {
      searchKey,
      searchResults: anime
    };
    navigate(`/anime/${id}`, { state: currentState });
  };

  const renderAnimeCard = (item) => (
    <>
      <Card.Img src={item.images.jpg.image_url} alt={item.title} />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Anime..."
        searchFunction={handleSearch}
        clearFunction={clearAnime}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={anime.map(a => ({ ...a, id: a.mal_id }))}
        renderItem={renderAnimeCard}
        onCardClick={handleCardClick}
      />
    </>
  );
};

export default Anime;



// import React, { useState } from 'react'; 
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom';
// import AppNavbar from '../../components/Navbar';
// import SearchBar from '../../components/SearchBar';
// import GridCard from '../../components/GridCard';
// import { Card } from 'react-bootstrap';

// const Anime = () => {
//   const [searchKey, setSearchKey] = useState("");
//   const [anime, setAnime] = useState([]);
//   const navigate = useNavigate();

//   const searchAnime = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get('https://api.jikan.moe/v4/anime', {
//         params: { q: searchKey, sfw: true }
//       });
//       setAnime(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching Anime:", error);
//       setAnime([]);
//     }
//   };

//   const clearAnime = () => {
//     setAnime([]);
//   };

//   const handleCardClick = (id) => {
//     navigate(`/anime/${id}`);
//   };

//   const renderAnimeCard = (item) => (
//     <>
//       <Card.Img src={item.images.jpg.image_url} alt={item.title} />
//       <Card.Body>
//         <Card.Title>{item.title}</Card.Title>
//       </Card.Body>
//     </>
//   );

//   return (
//     <>
//       <AppNavbar />
//       <SearchBar
//         placeholder="Search for Anime..."
//         searchFunction={searchAnime}
//         clearFunction={clearAnime}
//         searchKey={searchKey}
//         setSearchKey={setSearchKey}
//       />
//       <GridCard
//         items={anime.map(a => ({ ...a, id: a.mal_id }))}
//         renderItem={renderAnimeCard}
//         onCardClick={handleCardClick}
//       />
//     </>
//   );
// };

// export default Anime;

