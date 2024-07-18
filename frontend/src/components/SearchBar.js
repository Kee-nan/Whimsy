import React from 'react';
import { Form, FormControl, Button, Container } from 'react-bootstrap';

const SearchBar = ({ placeholder, searchFunction, clearFunction, searchKey, setSearchKey }) => {
  return (
    <div className="search-bar py-3">
      <Container>
        <Form className="search-bar-form" onSubmit={searchFunction}>
          <FormControl 
            className="oval-form-control"
            type="search"
            placeholder={placeholder}
            aria-label="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button type="submit" className="primaryButton">
            Search
          </button>
          <button type="button" onClick={clearFunction} className="secondaryButton">
            Clear
          </button>
        </Form>
      </Container>
    </div>
  );
};

export default SearchBar;
