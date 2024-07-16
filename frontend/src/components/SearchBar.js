import React from 'react';
import { Form, FormControl, Button, Container } from 'react-bootstrap';

const SearchBar = ({ placeholder, searchFunction, clearFunction, searchKey, setSearchKey }) => {
  return (
    <div className="search-bar py-3">
      <Container>
        <Form className="search-bar-form" onSubmit={searchFunction}>
          <FormControl
            type="search"
            placeholder={placeholder}
            className="form-control-lg"
            aria-label="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button type="submit" className="button-search ms-2">
            Search
          </button>
          <button type="button" onClick={clearFunction} className="button-clear ms-2">
            Clear
          </button>
        </Form>
      </Container>
    </div>
  );
};

export default SearchBar;
