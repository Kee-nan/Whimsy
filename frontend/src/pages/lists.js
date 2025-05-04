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

  const renderTable = (list) => (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Media Type</th>
            <th>User Rating</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {filterList(list).map((item, index) => {
            const review = ReviewData.find(r => r.id === `${item.id}`);
            return (
              <tr key={index} onClick={() => handleNavigate(item.id)} style={{ cursor: 'pointer' }}>
                <td>
                  <img src={item.image} alt={item.title} style={{ width: '60px', height: 'auto', borderRadius: '5px' }} />
                </td>
                <td>{item.title}</td>
                <td>{item.media}</td>
                <td>{review ? review.rating : '—'}</td>
                <td>{item.id}</td>
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  /**
   * FILTER DETAILS 
   */

  // Use state to determine prefered view
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table' 

  // Variables for filter searching through lists
  const [currentList, setCurrentList] = useState('current');
  const [currentMedia, setCurrentMedia] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
      setViewMode(location.state.viewMode)
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

  function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

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
          onViewModeChange={setViewMode}
          capitalizeFirstLetter={capitalizeFirstLetter}
        />

      <Container className="mt-5">
        {(() => {
          const listToRender = currentList === 'completed'
            ? lists.completed
            : currentList === 'futures'
              ? lists.futures
              : lists.current;

          return viewMode === 'card' ? renderList(listToRender) : renderTable(listToRender);
        })()}
      </Container>

    </>
  );
};

export default Lists;







