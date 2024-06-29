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
          <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
          <Nav.Link as={Link} to="/movies">Books</Nav.Link>
          <Nav.Link as={Link} to="/movies">Games</Nav.Link>
          <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

