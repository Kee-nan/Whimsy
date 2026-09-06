import React from 'react';
import { Dropdown, FormControl, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import MultiCheckDropdown from './MultiCheckDropdown';

const MEDIA_OPTIONS = [
  { key: 'movie', label: 'Movie' }, { key: 'show', label: 'Show' },
  { key: 'anime', label: 'Anime' }, { key: 'manga', label: 'Manga' },
  { key: 'book', label: 'Book' }, { key: 'game', label: 'Game' },
  { key: 'album', label: 'Album' },
];

const STATUS_OPTIONS = [
  { key: 'current', label: 'Current' },
  { key: 'completed', label: 'Completed' },
  { key: 'futures', label: 'Futures' },
];

const SearchAndDropdowns = ({
  selectedStatuses, onStatusChange,
  selectedMediaTypes, onMediaChange, mediaMultiMode, onToggleMediaMultiMode,
  tagOptions, selectedTags, onTagsChange,
  searchTerm, onSearchChange,
  isTableView, setIsTableView,
  onExportClick, onImportClick,
  columnOptions, visibleColumns, onToggleColumn,
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
    <div className="whimsy-search-bar py-3">
      <Container>
        <Form className="whimsy-search-form d-flex align-items-center gap-2 flex-wrap">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn-outline">
              {isTableView ? 'Table View' : 'Card View'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleViewChange('card')}>Card View</Dropdown.Item>
              <Dropdown.Item onClick={() => handleViewChange('table')}>Table View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <MultiCheckDropdown
            label="List Status" options={STATUS_OPTIONS}
            selected={selectedStatuses} onChange={onStatusChange}
            mode="multi" includeAllOption
          />

          <MultiCheckDropdown
            label="Media Type" options={MEDIA_OPTIONS}
            selected={selectedMediaTypes} onChange={onMediaChange}
            mode="toggle" multiMode={mediaMultiMode} onToggleMultiMode={onToggleMediaMultiMode}
            includeAllOption
          />

          <MultiCheckDropdown
            label="Tags" options={tagOptions}
            selected={selectedTags} onChange={onTagsChange}
            mode="multi" includeAllOption
          />

          <FormControl
            className="whimsy-form-control"
            placeholder="Search by title"
            aria-label="Search by title"
            value={searchTerm}
            onChange={onSearchChange}
          />

          <button className="whimsy-btn-outline" type="button" onClick={onImportClick}>Import</button>
          <button className="whimsy-btn-outline" type="button" onClick={onExportClick}>Export</button>

          {isTableView && (
            <MultiCheckDropdown
              label="Edit Columns" options={columnOptions}
              selected={visibleColumns} onChange={onToggleColumn}
              mode="multi"
            />
          )}
        </Form>
      </Container>
    </div>
  );
};

export default SearchAndDropdowns;


    