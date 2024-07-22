import React, { useEffect, useState } from 'react';
import { Container, DropdownButton, Dropdown, FormControl, InputGroup, Row, Col } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ListCard from '../components/ListCard';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchAndDropdowns from '../components/ListFilter';

const Lists = () => {
  const [completedList, setCompletedList] = useState([]);
  const [futuresList, setFuturesList] = useState([]);
  const [currentListData, setCurrentListData] = useState([]);
  const [ReviewData, setReviewData] = useState([]); // Initialized as an empty array

  const [currentList, setCurrentList] = useState('current');
  const [currentMedia, setCurrentMedia] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const user_token = localStorage.getItem('user_token');
      if (!user_token) {
        console.error('No user token found');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_token}`,
      };

      try {
        const completedResponse = await fetch('http://localhost:5000/api/list/completed', { headers });
        const futuresResponse = await fetch('http://localhost:5000/api/list/futures', { headers });
        const currentResponse = await fetch('http://localhost:5000/api/list/current', { headers });
        const reviewsResponse = await fetch('http://localhost:5000/api/list/reviews', { headers });

        if (currentResponse.ok && completedResponse.ok && futuresResponse.ok && reviewsResponse.ok) {
          const completedData = await completedResponse.json();
          const futuresData = await futuresResponse.json();
          const currentData = await currentResponse.json();
          const reviewsData = await reviewsResponse.json();
          
          setCompletedList(completedData);
          setFuturesList(futuresData);
          setCurrentListData(currentData);
          setReviewData(reviewsData);
        } else {
          console.error('Failed to fetch lists');
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location.state) {
      setCurrentList(location.state.currentList);
      setCurrentMedia(location.state.currentMedia);
      setSearchTerm(location.state.searchTerm);
    }
  }, [location.state]);

  const handleNavigate = (id) => {
    const currentState = {
      currentList,
      currentMedia,
      searchTerm,
      origin: 'list' // Add origin to state
    };
    navigate(`/${id}`, { state: currentState });
  };

  const handleDelete = async (id, listType) => {
    const user_token = localStorage.getItem('user_token');
    if (!user_token) {
      console.error('No user token found');
      return;
    }

    console.log(`Deleting item with id: ${id} from list: ${listType}`);
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user_token}`,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/list/delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ listType, id }),
      });
  
      if (response.ok) {
        const updatedList = listType === 'completedList' 
          ? completedList.filter(item => item.id !== id) 
          : listType === 'futuresList'
          ? futuresList.filter(item => item.id !== id)
          : currentList.filter(item => item.id !== id);
          
          if (listType === 'completedList') {
            setCompletedList(updatedList);
          } else if (listType === 'futuresList') {
            setFuturesList(updatedList);
          } else if (listType === 'currentList') {
            setCurrentListData(updatedList);
          }
  
        localStorage.setItem(listType, JSON.stringify(updatedList));
      } else {
        console.error('Failed to delete item from list');
      }
    } catch (error) {
      console.error('Error deleting item from list:', error);
      alert(`Error deleting item from list: ${error.message}`)
    }
  };

  const handleSelectList = (listName) => {
    setCurrentList(listName);
  };

  const handleSelectMedia = (mediaType) => {
    setCurrentMedia(mediaType);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterList = (list) => {
    return list.filter(item => {
      const matchesMedia = currentMedia === 'All' || item.media === currentMedia;
      const matchesSearch = item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMedia && matchesSearch;
    });
  };

  const renderList = (list, listType) => (
    <div className="row">
      {filterList(list).map((item, index) => (
        <div className="col-md-3 mb-4" key={index}>
          <ListCard
            item={item}
            onNavigate={handleNavigate}
            onDelete={(id) => handleDelete(id, listType)}
            type={item.type}
            listType={listType}
            reviewData={ReviewData} // Ensure correct prop name
          />
        </div>
      ))}
    </div>
  );
  

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

        {
          currentList === 'completed' ? renderList(completedList, 'completedList') : 
          currentList === 'futures' ? renderList(futuresList, 'futuresList') :
          renderList(currentListData, 'currentList')
        }

      </Container>
    </>
  );
};

export default Lists;







