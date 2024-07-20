import React from 'react';
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

// Function to fetch games from backend route
const searchGames = async (key) => {
  try {
    const response = await axios.get(`/api/search/games?q=${encodeURIComponent(key)}`);
    return { data: response.data.results || [] }; // Ensure data.results is always an array
  } catch (error) {
    console.error("Error fetching games:", error);
    alert("Error fetching games");
    return { data: [] }; // Return empty array if there's an error
  }
};

// Function to render each game card
const renderGameCard = (item) => (
  <>
    <Card.Img src={item.background_image} alt={item.name} className="grid-card-image album" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title>
    </Card.Body>
  </>
);

// GameSearch component
const GameSearch = () => (
  <SearchPage
    searchFunction={searchGames}
    renderCard={renderGameCard}
    placeholder="Game"
    extractId={(item) => item.id}
  />
);

export default GameSearch;



// import React from 'react';
// import SearchPage from '../templates/SearchPage';
// import { Card } from 'react-bootstrap';

// const searchGames = async (key) => {
//   const igdbToken = localStorage.getItem('igdbToken'); // Retrieve the IGDB token from local storage

//   try {
//     const response = await fetch(`/api/search/games?q=${encodeURIComponent(key)}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': igdbToken ? `Bearer ${igdbToken}` : '', // Include the token in the headers
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const data = await response.json();
//     return { data: data.results || [] }; // Ensure data.results is always an array
//   } catch (error) {
//     console.error("Error fetching games:", error);
//     alert("Error fetching games");
//     return { data: [] }; // Return empty array if there's an error
//   }
// };

// const renderGameCard = (item) => (
//   <>
//     <Card.Img src={item.cover?.url} alt={item.name} className="grid-card-image album" />
//     <Card.Body>
//       <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title>
//     </Card.Body>
//   </>
// );

// const GameSearch = () => (
//   <SearchPage
//     searchFunction={searchGames}
//     renderCard={renderGameCard}
//     placeholder="Games"
//     extractId={(item) => item.id}
//   />
// );

// export default GameSearch;