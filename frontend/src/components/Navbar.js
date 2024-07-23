import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleConfirmSignOut = () => {
    handleSignOut();
    setShowModal(false);
  };

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
            <Nav.Link as={Link} to="/friend" className="nav-link-button">Friend</Nav.Link>
            <Nav.Link onClick={handleShow} className="nav-link-button">Sign Out</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to sign out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSignOut}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppNavbar;


