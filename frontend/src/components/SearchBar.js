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
          <button type="submit" className="primaryButton">
            Search
          </button>
          <button type="button" onClick={clearFunction} className="secondaryButton">
            Clear
          </button>

          <FormControl
            className="oval-form-control"
            type="search"
            placeholder={placeholder}
            aria-label="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="view-toggle-button">
              {isTableView ? 'Table View' : 'Grid View'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setIsTableView(false)}>Grid View</Dropdown.Item>
              <Dropdown.Item onClick={() => setIsTableView(true)}>Table View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form>
      </Container>
    </div>
  );
};

export default SearchBar;

