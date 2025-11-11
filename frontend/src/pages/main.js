//frontend\src\pages\main.js
// jmmdw
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

import tmdbLogo from '../styles/images/TMDB.png';
import spotifyLogo from '../styles/images/Spotify.png';
import malLogo from '../styles/images/MAL.png';
import tvmazeLogo from '../styles/images/TVMaze.png';
import googleLogo from '../styles/images/Google.png';
import rawgLogo from '../styles/images/RAWG.png';

/**
 *  Main homepage
 *  Just has basic information about all of the media and details about the website.
 */
const MainPage = () => {
  return (
    <>
      <AppNavbar />

      <div className="welcome-section py-5">
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

      {/* Powered by grid */}
      <div className="features-section py-5" style={{ paddingBottom: '150px' }}>
        <Container fluid>
          <Row className="g-4 gy-4"> {/* g-4 adds spacing between columns */}
            {/* Example Card */}
            <Col md={6}>

              <Card className="homepage-card animate__animated animate__zoomIn">
                <div className="card-flex">
                  <img
                    src={spotifyLogo}
                    alt="Music"
                    className="card-img-left"
                  />
                  <Card.Body className="homepage-card-body">
                    <Card.Title className="homepage-card-title">Music Albums</Card.Title>
                    <Card.Subtitle className="homepage-card-subtitle">Powered by Spotify</Card.Subtitle>
                    <Card.Text className="homepage-card-text">
                      Music has been an integral part of human culture for thousands of years, evolving from ancient tribal rhythms and folk songs to the complex and diverse genres we enjoy today. The concept of the album as a collection of songs organized around a central theme emerged in the mid-20th century, transforming how artists present their work and how listeners experience music. From vinyl records to digital streams, the format of music consumption has continually evolved. With Spotify, you can access an extensive library of music that spans genres, eras, and cultures, offering a rich exploration of the art form. Spotify's powerful algorithms also help discover new favorites and dive deep into the rich history of music.
                    </Card.Text>
                  </Card.Body>
                </div>
              </Card>

              <Card className="homepage-card animate__animated animate__zoomIn">
                <div className="card-flex">
                  <img
                    src={googleLogo}
                    alt="Books"
                    className="card-img-left"
                  />
                  <Card.Body className="homepage-card-body">
                    <Card.Title className="homepage-card-title">Literature</Card.Title>
                    <Card.Subtitle className="homepage-card-subtitle">Powered by Google Books</Card.Subtitle>
                    <Card.Text className="homepage-card-text">
                      Books have long been a cornerstone of human expression, preserving ideas, stories, and knowledge across generations. From ancient manuscripts and printed tomes to modern e-books, the written word has continually evolved while remaining a vital force for imagination and learning. The art of storytelling through literature allows readers to explore diverse worlds, emotions, and perspectives. With digital platforms, you can instantly access a global library of fiction, nonfiction, and poetry, discovering new voices and timeless classics alike.
                    </Card.Text>
                  </Card.Body>
                </div>
              </Card>

              

              <Card className="homepage-card animate__animated animate__zoomIn">
                <div className="card-flex">
                  <img
                    src={tvmazeLogo}
                    alt="Music"
                    className="card-img-left"
                  />
                  <Card.Body className="homepage-card-body">
                    <Card.Title className="homepage-card-title">Television Series</Card.Title>
                    <Card.Subtitle className="homepage-card-subtitle">Powered by TVMaze</Card.Subtitle>
                    <Card.Text className="homepage-card-text">
                     Television series have revolutionized the way we consume stories and entertainment. Since the early days of TV, serialized storytelling has allowed for deeper character development and complex narratives that unfold over time. From the golden age of TV dramas and sitcoms to the streaming era’s original series, TV shows have become a central part of modern entertainment. They offer a mirror to our society, exploring various themes and issues in engaging ways. TVMaze provides an extensive database for exploring TV series, including detailed information on episodes, cast, and show history, helping viewers discover and appreciate the breadth of television content available.
                    </Card.Text>
                  </Card.Body>
                </div>
              </Card>

            </Col>

            <Col md={6}>

              <Card className="homepage-card animate__animated animate__zoomIn">
                <div className="card-flex">
                  <img
                    src={tmdbLogo}
                    alt="Cinema"
                    className="card-img-left"
                  />
                  <Card.Body className="homepage-card-body">
                    <Card.Title className="homepage-card-title">Cinema</Card.Title>
                    <Card.Subtitle className="homepage-card-subtitle">TMDB</Card.Subtitle>
                    <Card.Text className="homepage-card-text">
                      Cinema, as an art form and entertainment medium, has undergone remarkable evolution since its inception in the late 19th century. From the silent films of early cinema to the advent of sound and color, and now to the digital and streaming revolutions, movies have continuously adapted to new technologies and storytelling techniques. Cinema has become a global language, reflecting and shaping cultures through its narrative and visual artistry. Platforms like TMDB offer a comprehensive resource for discovering and exploring the vast array of films, from classic masterpieces to contemporary blockbusters. TMDB provides insights into movie details, reviews, and more, enriching your cinematic experience.
                    </Card.Text>
                  </Card.Body>
                </div>
              </Card>

              <Card className="homepage-card animate__animated animate__zoomIn">
                <div className="card-flex">
                  <img
                    src={malLogo}
                    alt="Anime and Manga"
                    className="card-img-left"
                  />
                  <Card.Body className="homepage-card-body">
                    <Card.Title className="homepage-card-title">Anime & Manga</Card.Title>
                    <Card.Subtitle className="homepage-card-subtitle">Powered by Mal/Jikan</Card.Subtitle>
                    <Card.Text className="homepage-card-text">
                      Originating in Japan, anime and manga have grown from niche entertainment into a global cultural phenomenon. Blending striking visual artistry with deep storytelling, these mediums capture a wide range of genres—from action and fantasy to romance and slice of life. Manga provides a serialized, often introspective reading experience, while anime brings those stories to life with color, sound, and motion. Today, streaming platforms and digital readers make it easier than ever to explore the vibrant world of Japanese animation and comics, bridging cultures through creativity.
                    </Card.Text>
                  </Card.Body>
                </div>
              </Card>

              <Card className="homepage-card animate__animated animate__zoomIn">
                <div className="card-flex">
                  <img
                    src={rawgLogo}
                    alt="Cinema"
                    className="card-img-left"
                  />
                  <Card.Body className="homepage-card-body">
                    <Card.Title className="homepage-card-title">Video Games</Card.Title>
                    <Card.Subtitle className="homepage-card-subtitle">Powered by RAWG</Card.Subtitle>
                    <Card.Text className="homepage-card-text">
                      Video games represent a unique fusion of art, technology, and interactive entertainment. Since the early days of arcade games and 8-bit consoles, video games have evolved into immersive experiences that blend storytelling, visuals, and gameplay. The medium has grown into a multi-billion-dollar industry with diverse genres and platforms, from casual mobile games to complex open-world adventures. Video games offer a way to engage with creative content actively and have become a significant cultural phenomenon. Explore the vibrant world of gaming through various platforms, and appreciate the creativity and technical skill that goes into developing these interactive experiences.
                    </Card.Text>
                  </Card.Body>
                </div>
              </Card>
            </Col>

          </Row>
        </Container>
      </div>

      <footer className="bg-dark text-light py-3">
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

















