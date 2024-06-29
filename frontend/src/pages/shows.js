import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FormControl, Button, Container, Row, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const Shows = () => {
  const [searchKey, setSearchKey] = useState("");
  const [shows, setShows] = useState([]);

  // Function to search shows using the TVMaze API
  const searchShows = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.get('https://api.tvmaze.com/search/shows', {
        params: { q: searchKey } // Use the search key as a query parameter
      });
      const responseJson = response.data;

      if (responseJson) {
        setShows(responseJson); // Update the state with the search results
      } else {
        setShows([]); // Clear the shows if no results are found
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
      setShows([]); // Clear the shows in case of an error
    }
  };

  // Function to clear the list of shows
  const clearShows = () => {
    setShows([]);
  };

  return (
    <>
      <AppNavbar />

      <div className="search-bar-container bg-light py-3">
        <Container>
          <Form className="d-flex" onSubmit={searchShows}>
            <FormControl
              type="search"
              placeholder="Search for Shows..."
              className="form-control-lg"
              aria-label="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button variant="outline-success" type="submit" className="ms-2">
              Search
            </Button>
            <Button variant="outline-danger" onClick={clearShows} className="ms-2">
              Clear
            </Button>
          </Form>
        </Container>
      </div>

      <Container className="mt-5">
        <Row className="mx-2 row row-cols-4">
          {shows.map((item) => (
            <Card key={item.show.id}>
              <Card.Img src={item.show.image ? item.show.image.medium : 'https://via.placeholder.com/210x295'} alt={item.show.name} />
              <Card.Body>
                <Card.Title>{item.show.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Shows;
