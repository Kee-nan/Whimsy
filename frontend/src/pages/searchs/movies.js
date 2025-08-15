
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

/**
 *  Search for movies with backend call
 */
const searchMovies = async (key) => {
  try {
    const response = await fetch(`/api/search/movies?q=${encodeURIComponent(key)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return { data: data.results || [] }; // Ensure data.results is always an array
  } catch (error) {
    console.error("Error fetching movies:", error);
    alert("Error fetching movies");
    return { data: [] }; // Return empty array if there's an error
  }
};

/**
 * Render Movie card 
 */
const renderMovieCard = (item) => (
  <>
    <Card.Img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="grid-card-image poster"/>
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
    </Card.Body>
  </>
);

/**
 *  Export the Search result to the search page template
 */
const MovieSearch = () => (
  <SearchPage
    searchFunction={searchMovies}
    renderCard={renderMovieCard}
    placeholder="Movie"
    extractId={(item) => item.id}
  />
);

export default MovieSearch;



