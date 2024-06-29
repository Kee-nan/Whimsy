import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FormControl, Button, Container, Row, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const Anime = () => {
  const [searchKey, setSearchKey] = useState("");
  const [anime, setAnime] = useState([]);

  // Function to search anime using the Jikan API
  const searchAnime = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: { q: searchKey, sfw: true } // Use the search key as a query parameter
      });
      const responseJson = response.data;

      if (responseJson.data) {
        setAnime(responseJson.data); // Update the state with the search results
      } else {
        setAnime([]); // Clear the Anime if no results are found
      }
    } catch (error) {
      console.error("Error fetching Anime:", error);
      setAnime([]); // Clear the Anime in case of an error
    }
  };

  // Function to clear the list of anime
  const clearAnime = () => {
    setAnime([]);
  };

  return (
    <>
      <AppNavbar />

      <div className="search-bar-container bg-light py-3">
        <Container>
          <Form className="d-flex" onSubmit={searchAnime}>
            <FormControl
              type="search"
              placeholder="Search for Anime..."
              className="form-control-lg"
              aria-label="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button variant="outline-success" type="submit" className="ms-2">
              Search
            </Button>
            <Button variant="outline-danger" onClick={clearAnime} className="ms-2">
              Clear
            </Button>
          </Form>
        </Container>
      </div>

      <Container className="mt-5">
        <Row className="mx-2 row row-cols-4">
          {anime.map((item) => (
            <Card key={item.mal_id}>
              <Card.Img src={item.images.jpg.image_url} alt={item.title} />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Anime;
