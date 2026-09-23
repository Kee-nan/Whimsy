import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import MultiCheckDropdown from './MultiCheckDropdown';

const STATUS_OPTIONS = [
  { key: 'current', label: 'Current' },
  { key: 'completed', label: 'Completed' },
  { key: 'futures', label: 'Futures' },
];

/**
 * Lets the user pick which statuses, tags, and columns to include before
 * generating the CSV — sourced from `detailedItems` (which already
 * carries ratings/dates) rather than the raw lists object, so exports
 * can include the same rich data the table view shows.
 */
const ExportModal = ({ show, onHide, detailedItems, tagsByItemId, tagOptions, columnOptions }) => {
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [selectedTags, setSelectedTags] = useState(['All']);
  const [selectedColumns, setSelectedColumns] = useState(columnOptions.map((c) => c.key));

  const handleConfirm = () => {
    const filtered = detailedItems.filter((item) => {
      const matchesStatus = selectedStatuses.includes('All') || selectedStatuses.includes(item.status);
      const itemTags = tagsByItemId[item.id] || [];
      const matchesTags = selectedTags.includes('All') || selectedTags.some((tid) => itemTags.some((t) => String(t.id) === tid));
      return matchesStatus && matchesTags;
    });

    if (filtered.length === 0) {
      alert('No items match the selected filters.');
      return;
    }

    const baseHeaders = ['title', 'media', 'status'];
    const dataHeaders = columnOptions.filter((c) => selectedColumns.includes(c.key) && !baseHeaders.includes(c.key)).map((c) => c.key);
    const headers = [...baseHeaders, ...dataHeaders];

    const cellValue = (item, key) => {
      switch (key) {
        case 'yourRating': return item.yourRating ?? '';
        case 'friendRating': return item.friendRating ?? '';
        case 'globalRating': return item.globalRating ?? '';
        case 'externalRating': return item.externalRating ?? '';
        case 'loggedAt': return item.loggedAt ? new Date(item.loggedAt).toLocaleDateString() : '';
        case 'friendsWithItem': return (item.friendsWithItem || []).map((f) => f.username).join('; ');
        case 'tags': return (tagsByItemId[item.id] || []).map((t) => t.name).join('; ');
        default: return item[key] ?? '';
      }
    };

    const rows = [headers.join(',')];
    for (const item of filtered) {
      rows.push(headers.map((h) => `"${String(cellValue(item, h)).replace(/"/g, '""')}"`).join(','));
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_media_lists.csv';
    link.click();
    URL.revokeObjectURL(url);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered className="custom-modal">
      <Modal.Header closeButton><Modal.Title>Export Lists</Modal.Title></Modal.Header>
      <Modal.Body>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>Choose what to include in your export.</p>
        <div className="d-flex flex-column gap-3">
          <div>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.3rem' }}>List Status</label>
            <MultiCheckDropdown label="List Status" options={STATUS_OPTIONS} selected={selectedStatuses} onChange={setSelectedStatuses} mode="multi" includeAllOption />
          </div>
          <div>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.3rem' }}>Tags</label>
            <MultiCheckDropdown label="Tags" options={tagOptions} selected={selectedTags} onChange={setSelectedTags} mode="multi" includeAllOption />
          </div>
          <div>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.3rem' }}>Columns</label>
            <MultiCheckDropdown label="Columns" options={columnOptions} selected={selectedColumns} onChange={setSelectedColumns} mode="multi" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="whimsy-btn whimsy-btn-ghost" onClick={onHide}>Cancel</button>
        <button className="whimsy-btn" onClick={handleConfirm}>Export CSV</button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;