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
    <Navbar className="navbar-custom" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/homepage">WHIMSY</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/album" className="nav-link-button nav-link-button">Albums</Nav.Link>
          <Nav.Link as={Link} to="/anime" className="nav-link-button nav-link-button">Anime</Nav.Link>
          <Nav.Link as={Link} to="/book" className="nav-link-button nav-link-button">Books</Nav.Link>
          <Nav.Link as={Link} to="/manga" className="nav-link-button nav-link-button">Manga</Nav.Link>
          <Nav.Link as={Link} to="/movie" className="nav-link-button nav-link-button">Movies</Nav.Link>
          <Nav.Link as={Link} to="/show" className="nav-link-button nav-link-button">Shows</Nav.Link>
          <Nav.Link as={Link} to="/game" className="nav-link-button nav-link-button">Games</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link as={Link} to="/profile" className="nav-link-button nav-link-button">
            Profile
          </Nav.Link>
          <Nav.Link as={Link} to="/lists" className="nav-link-button nav-link-button">
            Lists
          </Nav.Link>
          <Nav.Link onClick={handleSignOut} className="nav-link-button nav-link-button">
            Sign Out
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

