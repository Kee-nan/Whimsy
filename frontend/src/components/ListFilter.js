import React from 'react';
import { DropdownButton, Dropdown, FormControl, Container, Form, Button } from 'react-bootstrap';

const SearchAndDropdowns = ({
  currentList,
  currentMedia,
  searchTerm,
  onListChange,
  onMediaChange,
  onSearchChange,
  capitalizeFirstLetter,
  viewMode,
  onViewModeChange,
  onExportClick,
  onImportClick,
}) => {
  return (
    <div className="whimsy-search-bar py-3">
      <Container>
        <Form className="whimsy-search-form">
          
          {/* View Dropdown */}
          <DropdownButton
            id="list-dropdown"
            title= "View"
            className="whimsy-dropdown-view"
          >
            <Dropdown.Item onClick={() => onViewModeChange('card')}>Card View</Dropdown.Item>
            <Dropdown.Item onClick={() => onViewModeChange('table')}>Table View</Dropdown.Item>
          </DropdownButton>

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
          <button
            className="whimsy-btn-outline"
            onClick={onImportClick}
          >
            Import
          </button>

          <button
            className="whimsy-btn-outline"
            onClick={onExportClick}
          >
            Export
          </button>
        </Form>
      </Container>
    </div>
  );
};

export default SearchAndDropdowns;


    