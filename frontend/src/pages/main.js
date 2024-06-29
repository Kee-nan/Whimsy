import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const MainPage = () => {
  return (
    <>
      <AppNavbar />

      <div className="welcome-section bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h1 className="animate__animated animate__fadeInDown" style={{ fontFamily: 'Pacifico, cursive', fontSize: '3rem' }}>
                Welcome to <span style={{ color: 'purple' }}>WHIMSY</span>
              </h1>
              <p className="lead animate__animated animate__fadeInUp mt-3">
                <span style={{ color: 'purple' }}>WHIMSY</span> is here to celebrate the richness of human creativity and its many intricacies. It embraces the whimsical nature of media, recognizing that through it, we gain insights into the human condition. By exploring the tropes, themes, plots, characters, and melodies of creative works, we come to understand ourselves and each other better. Through shared experiences with these works, I believe we can draw humanity closer together.
              </p>
              <p className="lead animate__animated animate__fadeInUp mt-3">
                This app is here to help users keep track of all the media they have consumed, while finding new ones based on their interests as well. I hope this app allows people to reflect more on the creative works they consume, and what they can both learn and enjoy from them.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="features-section bg-white py-5" style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '80px' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <Card className="animate__animated animate__zoomIn mb-3" style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Title>Title</Card.Title>
                  <Card.Text>Bio ailebfgwsairlbgailjsdrbgrldjbfgliawsrbgpoagbpoa;gbrfpgjbarpogbedrg</Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
              <Card className="animate__animated animate__zoomIn mb-3" style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Title>Title</Card.Title>
                  <Card.Text>Bio ailebfgwsairlbgailjsdrbgrldjbfgliawsrbgpoagbpoa;gbrfpgjbarpogbedrg</Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
              <Card className="animate__animated animate__zoomIn mb-3" style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Title>Title</Card.Title>
                  <Card.Text>Bio ailebfgwsairlbgailjsdrbgrldjbfgliawsrbgpoagbpoa;gbrfpgjbarpogbedrg</Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
              <Card className="animate__animated animate__zoomIn mb-3" style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Title>Title</Card.Title>
                  <Card.Text>Bio ailebfgwsairlbgailjsdrbgrldjbfgliawsrbgpoagbpoa;gbrfpgjbarpogbedrg</Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
              <Card className="animate__animated animate__zoomIn mb-3" style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Title>Title</Card.Title>
                  <Card.Text>Bio ailebfgwsairlbgailjsdrbgrldjbfgliawsrbgpoagbpoa;gbrfpgjbarpogbedrg</Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <footer className="bg-dark text-light py-3" style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <p>&copy; 2024 WHIMSY. All rights reserved.</p>
              <p>Developed by Lil Keen the Freak. Special thanks to the joyous fox.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default MainPage;
















