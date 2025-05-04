//lists.js
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ListCard from '../components/ListCard';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchAndDropdowns from '../components/ListFilter';

const Lists = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Variables that will be loaded from the user account that will be filtered
  const [lists, setLists] = useState({
    completed: [],
    futures: [],
    current: [],
  });

  // Initialized as an empty array for Review Data
  const [ReviewData, setReviewData] = useState([]); 

  // Variables for filter searching through lists
  const [currentList, setCurrentList] = useState('current');
  const [currentMedia, setCurrentMedia] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Go and Fetch the lists and reviews from backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) return console.error('no user token');
  
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
  
      try {
        // ← single call for all lists:
        const res = await fetch('http://localhost:5000/api/list/lists', { headers });
        if (!res.ok) throw new Error('failed to fetch lists');
        const data = await res.json();
        setLists(data);
  
        // reviews unchanged:
        const rev = await fetch('http://localhost:5000/api/list/reviews', { headers });
        setReviewData(rev.ok ? await rev.json() : []);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);

  // Take the lists we got from the backend and then display them
  // We use list cards and display in rows of 3
  const renderList = (list) => (
    <div className="row">
      {filterList(list).map((item, index) => (
        <div className="col-md-4 mb-4" key={index}>
          <ListCard
            item={item}
            onNavigate={handleNavigate}
            type={item.type}
            reviewData={ReviewData}
          />
        </div>
      ))}
    </div>
  );

  /**
   * FILTER DETAILS 
   */

  // Filter by media type & search term
  const filterList = (list) => {
    return list.filter(item => {
      const matchesMedia = currentMedia === 'All' || item.media === currentMedia;
      const matchesSearch = item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMedia && matchesSearch;
    });
  };

  // Default the filters on the page
  useEffect(() => {
    if (location.state) {
      setCurrentList(location.state.currentList);
      setCurrentMedia(location.state.currentMedia);
      setSearchTerm(location.state.searchTerm);
    }
  }, [location.state]);

  // Restore filters if coming back from detail page
  useEffect(() => {
    if (location.state) {
      setCurrentList(location.state.currentList);
      setCurrentMedia(location.state.currentMedia);
      setSearchTerm(location.state.searchTerm);
    }
  }, [location.state]);
  
  // Dropdown handlers
  const handleSelectList = (listName) => {
    setCurrentList(listName);
  };

  const handleSelectMedia = (mediaType) => {
    setCurrentMedia(mediaType);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  

  //Function to take you to details when you click on an item
  const handleNavigate = (id) => {
    const currentState = {
      currentList,
      currentMedia,
      searchTerm,
      origin: 'list' // Add origin to state
    };
    navigate(`/${id}`, { state: currentState });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <AppNavbar />

      <SearchAndDropdowns
          currentList={currentList}
          currentMedia={currentMedia}
          searchTerm={searchTerm}
          onListChange={handleSelectList}
          onMediaChange={handleSelectMedia}
          onSearchChange={handleSearchChange}
          capitalizeFirstLetter={capitalizeFirstLetter}
        />

      <Container className="mt-5">
        { currentList==='completed'
            ? renderList(lists.completed)
            : currentList==='futures'
              ? renderList(lists.futures)
              : renderList(lists.current)
        }
      </Container>

    </>
  );
};

export default Lists;







