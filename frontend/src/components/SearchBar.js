import React from 'react';
import { Form, FormControl, Button, Container } from 'react-bootstrap';

const SearchBar = ({ placeholder, searchFunction, clearFunction, searchKey, setSearchKey }) => {
  return (
    <div className="search-bar-container bg-light py-3">
      <Container>
        <Form className="d-flex" onSubmit={searchFunction}>
          <FormControl
            type="search"
            placeholder={placeholder}
            className="form-control-lg"
            aria-label="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button variant="outline-success" type="submit" className="ms-2">
            Search
          </Button>
          <Button variant="outline-danger" onClick={clearFunction} className="ms-2">
            Clear
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default SearchBar;
