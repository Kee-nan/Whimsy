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
            <Nav.Link as={Link} to="/search" className="nav-link-button">Search</Nav.Link>
            <Nav.Link as={Link} to="/profile" className="nav-link-button">Profile</Nav.Link>
            <Nav.Link as={Link} to="/friend" className="nav-link-button">Friends</Nav.Link>
            <Nav.Link as={Link} to="/lists" className="nav-link-button">Lists</Nav.Link>
            <Nav.Link as={Link} to="/lists/custom" className="nav-link-button">Tags</Nav.Link>
            <Nav.Link as={Link} to="/global" className="nav-link-button">Leaderboard</Nav.Link>
          </Nav>
        </Container>

      </Navbar>
    </>
  );
};

export default AppNavbar;


