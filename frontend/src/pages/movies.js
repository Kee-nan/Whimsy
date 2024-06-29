import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FormControl, Button, Container, Row, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const Movies = () => {
  const [searchKey, setSearchKey] = useState("");
  const [movies, setMovies] = useState([]);

  // Function to search movies using the OMDb API
  const searchMovies = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.get(`http://www.omdbapi.com/?s=${searchKey}&apikey=7a51cf18`);
      const responseJson = response.data;

      if (responseJson.Search) {
        setMovies(responseJson.Search); // Update the state with the search results
      } else {
        setMovies([]); // Clear the movies if no results are found
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]); // Clear the movies in case of an error
    }
  };

  // Function to clear the list of movies
  const clearMovies = () => {
    setMovies([]);
  };

  return (
    <>
      <AppNavbar />

      <div className="search-bar-container bg-light py-3">
        <Container>
          <Form className="d-flex" onSubmit={searchMovies}>
            <FormControl
              type="search"
              placeholder="Search for movies..."
              className="form-control-lg"
              aria-label="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button variant="outline-success" type="submit" className="ms-2">
              Search
            </Button>
            <Button variant="outline-danger" onClick={clearMovies} className="ms-2">
              Clear
            </Button>
          </Form>
        </Container>
      </div>

      <Container className="mt-5">
        <Row className="mx-2 row row-cols-4">
          {movies.map((movie) => (
            <Card key={movie.imdbID}>
              <Card.Img src={movie.Poster} alt={movie.Title} />
              <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Movies;
