import React from 'react';
import { Form, FormControl, Container, Dropdown } from 'react-bootstrap';

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
    <div className="search-bar py-3">
      <Container>
        <Form className="search-bar-form d-flex align-items-center gap-2" onSubmit={searchFunction}>
          <button type="submit" className="btn btn-outline-light">
            Search
          </button>

          <button type="button" onClick={clearFunction} className="btn btn-outline-light">
            Clear
          </button>

          {/* Move Dropdown here with both Toggle and Menu */}
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="btn btn-outline-light">
              {isTableView ? 'Table View' : 'Grid View'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setIsTableView(false)}>Grid View</Dropdown.Item>
              <Dropdown.Item onClick={() => setIsTableView(true)}>Table View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Search input comes after buttons */}
          <FormControl
            className="oval-form-control"
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

