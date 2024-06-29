import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FormControl, Button, Container, Row, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const Manga = () => {
  const [searchKey, setSearchKey] = useState("");
  const [manga, setManga] = useState([]);

  // Function to search Manga using the Jikan API
  const searchManga = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.get('https://api.jikan.moe/v4/manga', {
        params: { q: searchKey, sfw: true } // Use the search key as a query parameter
      });
      const responseJson = response.data;

      if (responseJson.data) {
        setManga(responseJson.data); // Update the state with the search results
      } else {
        setManga([]); // Clear the Manga if no results are found
      }
    } catch (error) {
      console.error("Error fetching Manga:", error);
      setManga([]); // Clear the Manga in case of an error
    }
  };

  // Function to clear the list of anime
  const clearManga = () => {
    setManga([]);
  };

  return (
    <>
      <AppNavbar />

      <div className="search-bar-container bg-light py-3">
        <Container>
          <Form className="d-flex" onSubmit={searchManga}>
            <FormControl
              type="search"
              placeholder="Search for Manga..."
              className="form-control-lg"
              aria-label="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button variant="outline-success" type="submit" className="ms-2">
              Search
            </Button>
            <Button variant="outline-danger" onClick={clearManga} className="ms-2">
              Clear
            </Button>
          </Form>
        </Container>
      </div>

      <Container className="mt-5">
        <Row className="mx-2 row row-cols-4">
          {manga.map((item) => (
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

export default Manga;