import React from 'react';
import { DropdownButton, Dropdown, FormControl, Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const SearchAndDropdowns = ({
  currentList,
  currentMedia,
  searchTerm,
  onListChange,
  onMediaChange,
  onSearchChange,
  capitalizeFirstLetter,
  isTableView,
  setIsTableView,
  onExportClick,
  onImportClick,
}) => {

  const handleViewChange = async (viewType) => {
    setIsTableView(viewType === 'table');

    try {
      const user_token = localStorage.getItem('user_token');
      await axios.patch('http://localhost:5000/api/accounts/user/view-setting', {
        view_setting: viewType,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
        }
      });
    } catch (error) {
      console.error('Error updating view setting:', error);
    }
  };

  return (
    <div className="whimsy-search-bar py-3">
      <Container>
        <Form className="whimsy-search-form">
          
          {/* View Dropdown */}
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn-outline">
              {isTableView ? 'Table View' : 'Card View'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleViewChange('card')}>Card View</Dropdown.Item>
              <Dropdown.Item onClick={() => handleViewChange('table')}>Table View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Filter for List */}
          <DropdownButton
            id="media-dropdown"
            title={currentList === 'completed' ? 'Completed' : currentList === 'futures' ? 'Futures' : 'Current'}
            className="whimsy-dropdown-list"
          >
            <Dropdown.Item onClick={() => onListChange('completed')}>Completed</Dropdown.Item>
            <Dropdown.Item onClick={() => onListChange('current')}>Current</Dropdown.Item>
            <Dropdown.Item onClick={() => onListChange('futures')}>Futures</Dropdown.Item>
          </DropdownButton>

          {/* Filter for media classification */}
          <DropdownButton
            id="media-dropdown"
            title={capitalizeFirstLetter(currentMedia)}
            className="whimsy-dropdown-media"
          >
            <Dropdown.Item onClick={() => onMediaChange('All')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('anime')}>Anime</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('album')}>Album</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('show')}>Show</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('book')}>Book</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('movie')}>Movie</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('manga')}>Manga</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('game')}>Game</Dropdown.Item>
          </DropdownButton>

          {/* Search input */}
          <FormControl
            className="whimsy-form-control"
            placeholder="Search by title"
            aria-label="Search by title"
            aria-describedby="basic-addon2"
            value={searchTerm}
            onChange={onSearchChange}
          />

          {/* Import and Export Buttons */}
          <Button
            className="whimsy-btn-outline"
            onClick={onImportClick}
          >
            Import
          </Button>

          <Button
            className="whimsy-btn-outline"
            onClick={onExportClick}
          >
            Export
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default SearchAndDropdowns;


    