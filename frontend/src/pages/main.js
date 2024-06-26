// Imports
import React, { useState, useEffect } from 'react'; 
import styles from './main.module.css'; 
import MediaComponent from '../components/mediaobject';
import '../components/mediaobject.module.css'
import axios from 'axios'

//Dummy data
// const dummyMediaData = [
//   {
//     id: 1,
//     image: 'https://via.placeholder.com/150',
//     title: 'Sample Media 1',
//     creator: 'Creator 1',
//     rating: 4.5,
//     status: 'Available',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   },
//   {
//     id: 2,
//     image: 'https://via.placeholder.com/150',
//     title: 'Sample Media 2',
//     creator: 'Creator 2',
//     rating: 3.8,
//     status: 'In Progress',
//     description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//   },
//   // Add more dummy data as needed
// ];


const MainPage = () => {

  // Spotify connection info
  const CLIENT_ID = "9c9e11af68d84276b6cabc7148ffc82c"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

  // const getToken = () => {
  //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
  //     let token = urlParams.get('access_token');
  // }

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      // getToken()


      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)

  }, [])

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
      e.preventDefault()
      const {data} = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
              Authorization: `Bearer ${token}`
          },
          params: {
              q: searchKey,
              type: "artist"
          }
      })

      setArtists(data.artists.items)
  }

  const renderArtists = () => {
      return artists.map(artist => (
          <div key={artist.id}>
              {artist.images.length ? <img width={"25%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
              {artist.name}
          </div>
      ))
  }

  return (
    <div className={styles.mainPage}>

      {/* Toolbar */}
      <header className={styles.toolbar}>
        <div className={styles.logo}>MyMediaApp</div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for media..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>Search</button>
        </div>
        <nav className={styles.navButtons}>
          <button className={styles.navButton}>Profile</button>
          <button className={styles.navButton}>Lists</button>
         
        </nav>
      </header>
      <div>
        {!token ?
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                to Spotify</a>
            : <button onClick={logout}>Logout</button>}

        {token ?
            <form onSubmit={searchArtists}>
                <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                <button type={"submit"}>Search</button>
            </form>

            : <h2>Please login</h2>
        }

        {renderArtists()}
      </div>
    </div>
  );
}

export default MainPage;


