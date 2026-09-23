import React from 'react';
import { Dropdown, FormControl, Form } from 'react-bootstrap';
import axios from 'axios';
import MultiCheckDropdown from './MultiCheckDropdown';

const MEDIA_OPTIONS = [
  { key: 'movie', label: 'Movie' }, { key: 'show', label: 'Show' },
  { key: 'anime', label: 'Anime' }, { key: 'manga', label: 'Manga' },
  { key: 'book', label: 'Book' }, { key: 'game', label: 'Game' }, { key: 'album', label: 'Album' },
];
const STATUS_OPTIONS = [
  { key: 'current', label: 'Current' }, { key: 'completed', label: 'Completed' }, { key: 'futures', label: 'Futures' },
];

const GROUP_OPTIONS = [
  { value: 'none', label: 'No Grouping' },
  { value: 'media', label: 'Group by Type' },
  { value: 'status', label: 'Group by Status' },
];

const SearchAndDropdowns = ({
  selectedStatuses, onStatusChange,
  selectedMediaTypes, onMediaChange, mediaMultiMode, onToggleMediaMultiMode,
  tagOptions, selectedTags, onTagsChange,
  searchTerm, onSearchChange,
  isTableView, setIsTableView,
  onExportClick, onImportClick,
  columnOptions, visibleColumns, onToggleColumn,
  ratedOnly, onRatedOnlyChange,
  friendsLoggedOnly, onFriendsLoggedOnlyChange,
  groupBy, onGroupByChange,
}) => {
  const handleViewChange = async (viewType) => {
    setIsTableView(viewType === 'table');
    try {
      const user_token = localStorage.getItem('user_token');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/accounts/user/view-setting`, { view_setting: viewType }, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user_token}` },
      });
    } catch (error) { console.error('Error updating view setting:', error); }
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn">
            {isTableView ? 'Table View' : 'Card View'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleViewChange('card')}>Card View</Dropdown.Item>
            <Dropdown.Item onClick={() => handleViewChange('table')}>Table View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <MultiCheckDropdown label="List Status" options={STATUS_OPTIONS} selected={selectedStatuses} onChange={onStatusChange} mode="multi" includeAllOption />
        <MultiCheckDropdown label="Media Type" options={MEDIA_OPTIONS} selected={selectedMediaTypes} onChange={onMediaChange} mode="toggle" multiMode={mediaMultiMode} onToggleMultiMode={onToggleMediaMultiMode} includeAllOption />
        <MultiCheckDropdown label="Tags" options={tagOptions} selected={selectedTags} onChange={onTagsChange} mode="multi" includeAllOption />

        <FormControl className="whimsy-form-control filter-bar-search" placeholder="Search by title" value={searchTerm} onChange={onSearchChange} />

        
        {isTableView && <MultiCheckDropdown className="filter-bar-select" label="Edit Columns" options={columnOptions} selected={visibleColumns} onChange={onToggleColumn} mode="multi" />}

        {isTableView && (
          <>
            <Form.Check className="filter-bar-check" type="checkbox" id="rated-only" label="Rated only" checked={ratedOnly} onChange={(e) => onRatedOnlyChange(e.target.checked)} />
            <Form.Check className="filter-bar-check" type="checkbox" id="friends-logged" label="Friends logged" checked={friendsLoggedOnly} onChange={(e) => onFriendsLoggedOnlyChange(e.target.checked)} />
            <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn whimsy-btn-ghost filter-bar-select" style={{ width: '150px' }}>
              {GROUP_OPTIONS.find((o) => o.value === groupBy)?.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {GROUP_OPTIONS.map((o) => (
                <Dropdown.Item key={o.value} onClick={() => onGroupByChange(o.value)}>{o.label}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          </>
        )}

        <button className="whimsy-btn whimsy-btn-ghost" type="button" onClick={onImportClick}>Import</button>
        <button className="whimsy-btn whimsy-btn-ghost" type="button" onClick={onExportClick}>Export</button>
      </div>
    </div>
  );
};

export default SearchAndDropdowns;


    