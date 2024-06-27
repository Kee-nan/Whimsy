// Imports
import React, { useState, useEffect } from 'react'; 
import styles from './main.module.css'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, FormControl, Button, Container, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const CLIENT_ID = "9c9e11af68d84276b6cabc7148ffc82c";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
      const hash = window.location.hash;
      let token = window.localStorage.getItem("token");

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
          window.location.hash = "";
          window.localStorage.setItem("token", token);
      }

      setToken(token);
  }, []);

  const logout = () => {
      setToken("");
      window.localStorage.removeItem("token");
  };

  const searchAlbums = async (e) => {
      e.preventDefault();
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
              Authorization: `Bearer ${token}`
          },
          params: {
              q: searchKey,
              type: "album"
          }
      });

      setAlbums(data.albums.items);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Whimsy</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              <Nav.Link href="#">Lists</Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={searchAlbums}>
              <FormControl
                type="search"
                placeholder="Search for media..."
                className="me-2"
                aria-label="Search"
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <Button variant="outline-success" type="submit">Search</Button>
            </Form>
            {token ? (
              <Button variant="outline-danger" onClick={logout}>Logout</Button>
            ) : (
              <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`} className="btn btn-outline-light ml-2">Login to Spotify</a>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <MainPageContent albums={albums} />
    </>
  );
};

const MainPageContent = ({ albums }) => {
  return (
    <Container>
      <Row className="mx-2 row row-cols-4">
        {albums.map((album) => (
          <Card key={album.id}>
            <Card.Img src={album.images[0].url} />
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default MainPage;






//     // Nav bar 
//     <div className={styles.mainPage}>
//       <div className={styles.mainPage}>
//       <Navbar bg="dark" variant="dark" expand="lg">
//         <Container>
//           <Navbar.Brand href="#">Whimsy</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="me-auto">
//               <Nav.Link href="#">Profile</Nav.Link>
//               <Nav.Link href="#">Lists</Nav.Link>
//             </Nav>
//             <Form className="d-flex" onSubmit={searchAlbums}>
//               <FormControl
//                 type="search"
//                 placeholder="Search for media..."
//                 className="me-2"
//                 aria-label="Search"
//                 onChange={(e) => setSearchKey(e.target.value)}
//               />
//               <Button variant="outline-success" type="submit">Search</Button>
//             </Form>
//             {token ? (
//               <Button variant="outline-danger" onClick={logout}>Logout</Button>
//             ) : (
//               <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`} className="btn btn-outline-light ml-2">Login to Spotify</a>
//             )}
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Display Search Results */}
//       <Container>
//         <Row className = "mx-2 row row-cols-4">
//           {albums.map( (album, i) => {
//             return(
//               <Card>
//                 <Card.Img src={album.images[0].url}/>
//                 <Card.Body>
//                   <Card.Title> {album.name} </Card.Title>
//                 </Card.Body>
//               </Card>
//             )
//           })}
//         </Row>
//       </Container>

//       </div>
//     </div>
//   );
// }

// export default MainPage;


