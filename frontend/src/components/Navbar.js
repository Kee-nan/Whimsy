import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Whimsy</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          <Nav.Link as={Link} to="/movies">Television</Nav.Link>
          <Nav.Link as={Link} to="/anime">Anime</Nav.Link>
          <Nav.Link as={Link} to="/manga">Manga</Nav.Link>
          <Nav.Link as={Link} to="/movies">Books</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

