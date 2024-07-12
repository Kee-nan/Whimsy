import React, { useEffect, useState } from 'react';
import { Container, DropdownButton, Dropdown, FormControl, InputGroup, Row, Col } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ListCard from '../components/ListCard';
import { useNavigate } from 'react-router-dom';

const Lists = () => {
  const [completedList, setCompletedList] = useState([]);
  const [futuresList, setFuturesList] = useState([]);
  const [currentList, setCurrentList] = useState('completed');
  const [currentMedia, setCurrentMedia] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

        if (completedResponse.ok && futuresResponse.ok) {
          const completedData = await completedResponse.json();
          const futuresData = await futuresResponse.json();
          
          setCompletedList(completedData);
          setFuturesList(futuresData);
        } else {
          console.error('Failed to fetch lists');
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (id) => {
    const currentState = {
      currentList,
      currentMedia,
      searchTerm
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
          : futuresList.filter(item => item.id !== id);
        
        if (listType === 'completedList') {
          setCompletedList(updatedList);
        } else {
          setFuturesList(updatedList);
        }
  
        localStorage.setItem(listType, JSON.stringify(updatedList));
      } else {
        console.error('Failed to delete item from list');
      }
    } catch (error) {
      console.error('Error deleting item from list:', error);
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
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <h2>Your Lists</h2>
        <Row className="align-items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <Col xs="auto">
            <DropdownButton id="list-dropdown" title={currentList === 'completed' ? 'Completed' : 'Futures'} className="mr-2">
              <Dropdown.Item onClick={() => handleSelectList('completed')}>Completed</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectList('futures')}>Futures</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col xs="auto">
            <DropdownButton id="media-dropdown" title={currentMedia} className="mr-2">
              <Dropdown.Item onClick={() => handleSelectMedia('All')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectMedia('anime')}>Anime</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectMedia('album')}>Album</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectMedia('show')}>Show</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectMedia('book')}>Book</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectMedia('movie')}>Movie</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectMedia('manga')}>Manga</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col>
            <InputGroup>
              <FormControl
                placeholder="Search by title"
                aria-label="Search by title"
                aria-describedby="basic-addon2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Col>
        </Row>
        {currentList === 'completed' ? renderList(completedList, 'completedList') : renderList(futuresList, 'futuresList')}
      </Container>
    </>
  );
};

export default Lists;






