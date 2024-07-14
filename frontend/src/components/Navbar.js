import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/homepage">Whimsy</Navbar.Brand>
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
          <Nav.Link onClick={handleSignOut} className="btn btn-outline-grey me-2">
            Sign Out
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

