import React from 'react';
import { Form, FormControl, Container, Dropdown } from 'react-bootstrap';
import '../styles/formsandbuttons.css';
import axios from 'axios';

const SearchBar = ({
  placeholder, searchFunction, clearFunction,
  searchKey, setSearchKey, isTableView, setIsTableView,
  mediaTypeSelector, // NEW — media-type tab buttons, rendered inline
}) => {
  const handleViewChange = async (viewType) => {
    setIsTableView(viewType === 'table');
    try {
      const user_token = localStorage.getItem('user_token');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/accounts/user/view-setting`, {
        view_setting: viewType,
      }, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user_token}` } });
    } catch (error) {
      console.error('Error updating view setting:', error);
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <button type="submit" className="whimsy-btn" onClick={searchFunction}>Search</button>
        <button type="button" onClick={clearFunction} className="whimsy-btn whimsy-btn-ghost">Clear</button>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn whimsy-btn-ghost">
            {isTableView ? 'Table View' : 'Card View'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleViewChange('card')}>Card View</Dropdown.Item>
            <Dropdown.Item onClick={() => handleViewChange('table')}>Table View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <FormControl
          className="whimsy-form-control filter-bar-search"
          type="search"
          placeholder={placeholder}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        {mediaTypeSelector && <div className="unified-search-tabs">{mediaTypeSelector}</div>}
      </div>
    </div>
  );
};

export default SearchBar;

