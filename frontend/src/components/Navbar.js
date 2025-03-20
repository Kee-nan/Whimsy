import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Navbar across the top of the screen with all the buttons
const AppNavbar = () => {

  return (
    <>
      <Navbar className="navbar-custom" expand="lg">

        <Container>

          <Navbar.Brand as={Link} to="/homepage">WHIMSY</Navbar.Brand>
          
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/album" className="nav-link-button">Albums</Nav.Link>
            <Nav.Link as={Link} to="/anime" className="nav-link-button">Anime</Nav.Link>
            <Nav.Link as={Link} to="/book" className="nav-link-button">Books</Nav.Link>
            <Nav.Link as={Link} to="/manga" className="nav-link-button">Manga</Nav.Link>
            <Nav.Link as={Link} to="/movie" className="nav-link-button">Movies</Nav.Link>
            <Nav.Link as={Link} to="/show" className="nav-link-button">Shows</Nav.Link>
            <Nav.Link as={Link} to="/game" className="nav-link-button">Games</Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/profile" className="nav-link-button">Profile</Nav.Link>
            <Nav.Link as={Link} to="/lists" className="nav-link-button">Lists</Nav.Link>
            <Nav.Link as={Link} to="/friend" className="nav-link-button">Friends</Nav.Link>
          </Nav>
        </Container>

      </Navbar>
    </>
  );
};

export default AppNavbar;


