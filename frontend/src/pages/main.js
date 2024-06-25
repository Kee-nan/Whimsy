// Imports
import React, { useState, useEffect } from 'react'; 
import styles from './main.module.css'; 
import MediaComponent from '../components/mediaobject';
import '../components/mediaobject.module.css'

//Dummy data
const dummyMediaData = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150',
    title: 'Sample Media 1',
    creator: 'Creator 1',
    rating: 4.5,
    status: 'Available',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150',
    title: 'Sample Media 2',
    creator: 'Creator 2',
    rating: 3.8,
    status: 'In Progress',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  // Add more dummy data as needed
];


const MainPage = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State variable for the search query
  const [searchResults, setSearchResults] = useState([]); // State variable for the search results

  useEffect(() => {
    // Optional: Fetch initial data or perform other side effects here
  }, []); // Empty dependency array means this runs only once after the initial render

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query state with the input value
  };

  const handleSearch = async () => {
    const response = await fetch(`https://api.example.com/search?query=${searchQuery}`);
    const data = await response.json();
    setSearchResults(data.results); // Update the search results state with the API response
  };

  return (
    <div className={styles.mainPage}>
      <header className={styles.toolbar}>
        <div className={styles.logo}>MyMediaApp</div>
        <div className={styles.searchBar}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for media..."
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>Search</button>
        </div>
        <nav className={styles.navButtons}>
          <button className={styles.navButton}>Profile</button>
          <button className={styles.navButton}>Lists</button>
        </nav>
      </header>
      <div className={styles.mediaList}>
        {dummyMediaData.map((media) => (
          <MediaComponent
            key={media.id}
            image={media.image}
            title={media.title}
            creator={media.creator}
            rating={media.rating}
            status={media.status}
            description={media.description}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
