import React from 'react';
import { DropdownButton, Dropdown, FormControl, Container, Form } from 'react-bootstrap';

const SearchAndDropdowns = ({
  currentList,
  currentMedia,
  searchTerm,
  onListChange,
  onMediaChange,
  onSearchChange,
  capitalizeFirstLetter,
}) => {
  return (
    <div className="search-bar py-3">
      <Container>
        <Form className="search-bar-form">
          <DropdownButton
            id="list-dropdown"
            title={currentList === 'completed' ? 'Completed' : currentList === 'futures' ? 'Futures' : 'Current'}
            className={`custom-dropdown ${currentList}`}
          >
            <Dropdown.Item onClick={() => onListChange('completed')}>Completed</Dropdown.Item>
            <Dropdown.Item onClick={() => onListChange('current')}>Current</Dropdown.Item>
            <Dropdown.Item onClick={() => onListChange('futures')}>Futures</Dropdown.Item>
          </DropdownButton>

          <DropdownButton
            id="media-dropdown"
            title={capitalizeFirstLetter(currentMedia)}
            className={`media-dropdown`}
          >
            <Dropdown.Item onClick={() => onMediaChange('All')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('anime')}>Anime</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('album')}>Album</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('show')}>Show</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('book')}>Book</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('movie')}>Movie</Dropdown.Item>
            <Dropdown.Item onClick={() => onMediaChange('manga')}>Manga</Dropdown.Item>
          </DropdownButton>

          <FormControl
              className="oval-form-control"
              placeholder="Search by title"
              aria-label="Search by title"
              aria-describedby="basic-addon2"
              value={searchTerm}
              onChange={onSearchChange}
            />
        </Form>
      </Container>
    </div>
  );
};

export default SearchAndDropdowns;


    