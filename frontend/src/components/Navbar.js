import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Whimsy</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/albums">Albums</Nav.Link>
          <Nav.Link as={Link} to="/anime">Anime</Nav.Link>
          <Nav.Link as={Link} to="/books">Books</Nav.Link>
          <Nav.Link as={Link} to="/manga">Manga</Nav.Link>
          <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
          <Nav.Link as={Link} to="/shows">Shows</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link as={Link} to="/profile" className="btn btn-outline-grey me-2">
            Profile
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
