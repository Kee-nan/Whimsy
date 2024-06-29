import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FormControl, Button, Container, Row, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const MainPage = () => {
  const [searchKey, setSearchKey] = useState("");
  const [albums, setAlbums] = useState([]);

  const searchAlbums = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('spotifyToken');
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: "album"
        }
      });
      setAlbums(data.albums.items);
    } catch (error) {
      console.error(error);
    }
  };

  const clearAlbums = () => {
    setAlbums([]);
  };

  return (
    <>
      <AppNavbar />

      <div className="search-bar-container bg-light py-3">
        <Container>
          <Form className="d-flex" onSubmit={searchAlbums}>
            <FormControl
              type="search"
              placeholder="Search for media..."
              className="form-control-lg"
              aria-label="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button variant="outline-success" type="submit" className="ms-2">
              Search
            </Button>
            <Button variant="outline-danger" onClick={clearAlbums} className="ms-2">
              Clear
            </Button>
          </Form>
        </Container>
      </div>

      <Container className="mt-5">
        <Row className="mx-2 row row-cols-4">
          {albums.map((album) => (
            <Card key={album.id}>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default MainPage;












