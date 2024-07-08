import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Whimsy</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/album">Albums</Nav.Link>
          <Nav.Link as={Link} to="/anime">Anime</Nav.Link>
          <Nav.Link as={Link} to="/book">Books</Nav.Link>
          <Nav.Link as={Link} to="/manga">Manga</Nav.Link>
          <Nav.Link as={Link} to="/movie">Movies</Nav.Link>
          <Nav.Link as={Link} to="/show">Shows</Nav.Link>
          <Nav.Link as={Link} to="/game">Games</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link as={Link} to="/profile" className="btn btn-outline-grey me-2">
            Profile
          </Nav.Link>
          <Nav.Link as={Link} to="/lists" className="btn btn-outline-grey me-2">
            Lists
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
