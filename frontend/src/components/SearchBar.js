import React from 'react';
import { Form, FormControl, Container, Dropdown } from 'react-bootstrap';
import '../styles/formsandbuttons.css';

const SearchBar = ({
  placeholder,
  searchFunction,
  clearFunction,
  searchKey,
  setSearchKey,
  isTableView,
  setIsTableView
}) => {
  return (
    <div className="whimsy-search-bar py-3">
      <Container>
        <Form className="whimsy-search-form d-flex align-items-center gap-2" onSubmit={searchFunction}>
          <button type="submit" className="whimsy-btn-outline">Search</button>
          <button type="button" onClick={clearFunction} className="whimsy-btn-outline">Clear</button>

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn-outline">
              {isTableView ? 'Table View' : 'Grid View'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setIsTableView(false)}>Grid View</Dropdown.Item>
              <Dropdown.Item onClick={() => setIsTableView(true)}>Table View</Dropdown.Item>
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

