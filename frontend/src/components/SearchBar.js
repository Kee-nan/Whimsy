import React from 'react';
import { Form, FormControl, Container, Dropdown } from 'react-bootstrap';
import '../styles/formsandbuttons.css';
import axios from 'axios';

const SearchBar = ({
  placeholder,
  searchFunction,
  clearFunction,
  searchKey,
  setSearchKey,
  isTableView,
  setIsTableView
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
        <Form className="whimsy-search-form d-flex align-items-center gap-2" onSubmit={searchFunction}>
          <button type="submit" className="whimsy-btn-outline">Search</button>
          <button type="button" onClick={clearFunction} className="whimsy-btn-outline">Clear</button>

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn-outline">
              {isTableView ? 'Table View' : 'Card View'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleViewChange('card')}>Card View</Dropdown.Item>
              <Dropdown.Item onClick={() => handleViewChange('table')}>Table View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <FormControl
            className="whimsy-form-control"
            type="search"
            placeholder={placeholder}
            aria-label="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </Form>
      </Container>
    </div>
  );
};


export default SearchBar;

