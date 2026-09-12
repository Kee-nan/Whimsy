import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import MultiCheckDropdown from '../lists/MultiCheckDropdown';
import TagsCell from '../lists/TagsCell';

const PAGE_SIZE = 50;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const STATUS_OPTIONS = [
  { key: 'current', label: 'Current' }, { key: 'completed', label: 'Completed' }, { key: 'futures', label: 'Futures' },
];
const MEDIA_OPTIONS = [
  { key: 'movie', label: 'Movie' }, { key: 'show', label: 'Show' }, { key: 'anime', label: 'Anime' },
  { key: 'manga', label: 'Manga' }, { key: 'book', label: 'Book' }, { key: 'game', label: 'Game' }, { key: 'album', label: 'Album' },
];
const COLUMN_DEFINITIONS = [
  { key: 'status', label: 'List Status' },
  { key: 'friendRating', label: "Friend's Rating" },
  { key: 'globalRating', label: 'Whimsy Rating' },
  { key: 'externalRating', label: 'Source Rating' },
  { key: 'loggedAt', label: 'Date Logged' },
  { key: 'tags', label: 'Tags' },
];

const FriendListTable = ({ friendId, friendUsername }) => {
  const [items, setItems] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState(['All']);
  const [mediaMultiMode, setMediaMultiMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState(['All']);
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(COLUMN_DEFINITIONS.map((c) => c.key));
  const [sortColumn, setSortColumn] = useState('loggedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [groupBy, setGroupBy] = useState('none');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/${friendId}/lists/detailed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems((await res.json()).items);
    };
    fetchData();
  }, [friendId]);

  const tagOptions = useMemo(() => {
    const map = new Map();
    items.forEach((item) => (item.tags || []).forEach((t) => map.set(String(t.id), t.name)));
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [items]);

  const filtered = useMemo(() => items.filter((item) => {
    const matchesStatus = selectedStatuses.includes('All') || selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
    const matchesMedia = selectedMediaTypes.includes('All') || selectedMediaTypes.length === 0 || selectedMediaTypes.includes(item.media);
    const matchesTags = selectedTags.includes('All') || selectedTags.length === 0 ||
      selectedTags.some((tid) => (item.tags || []).some((t) => String(t.id) === tid));
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesMedia && matchesTags && matchesSearch;
  }), [items, selectedStatuses, selectedMediaTypes, selectedTags, search]);

  const getSortValue = (item, key) => {
    switch (key) {
      case 'friendRating': return item.friendRating ?? -1;
      case 'globalRating': return item.globalRating ?? -1;
      case 'externalRating': return item.externalRating ?? -1;
      case 'loggedAt': return item.loggedAt ? new Date(item.loggedAt).getTime() : 0;
      case 'tags': return (item.tags || []).map((t) => t.name).sort().join(',');
      case 'title': return (item.title || '').toLowerCase();
      default: return item[key] ?? '';
    }
  };

  const groupValue = (item) => (groupBy === 'media' ? item.media : groupBy === 'status' ? item.status : null);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (groupBy !== 'none') {
        const ga = groupValue(a), gb = groupValue(b);
        if (ga !== gb) return ga < gb ? -1 : 1;
      }
      const va = getSortValue(a, sortColumn), vb = getSortValue(b, sortColumn);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortColumn, sortDir, groupBy]);

  useEffect(() => { setPage(1); }, [selectedStatuses, selectedMediaTypes, selectedTags, search, groupBy]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortColumn === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortColumn(key); setSortDir('asc'); }
  };
  const arrow = (key) => (sortColumn === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  const activeColumns = COLUMN_DEFINITIONS.filter((c) => visibleColumns.includes(c.key));
  const friendRatingLabel = `${friendUsername}'s Rating`;

  const renderCell = (key, item) => {
    switch (key) {
      case 'status': return cap(item.status);
      case 'friendRating': return item.friendRating != null ? `${item.friendRating}/30` : '—';
      case 'globalRating': return item.globalRating != null ? `${item.globalRating}/30 (${item.globalRatingCount})` : '—';
      case 'externalRating': return item.externalRating != null ? `${item.externalRating}/30` : '—';
      case 'loggedAt': return item.loggedAt ? new Date(item.loggedAt).toLocaleDateString() : '—';
      case 'tags': return <TagsCell tags={item.tags} />;
      default: return item[key];
    }
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <h4 className="filter-bar-title">Viewing {friendUsername}'s Lists</h4>
          <MultiCheckDropdown label="List Status" options={STATUS_OPTIONS} selected={selectedStatuses} onChange={setSelectedStatuses} mode="multi" includeAllOption />
          <MultiCheckDropdown label="Media Type" options={MEDIA_OPTIONS} selected={selectedMediaTypes} onChange={setSelectedMediaTypes} mode="toggle" multiMode={mediaMultiMode} onToggleMultiMode={setMediaMultiMode} includeAllOption />
          <MultiCheckDropdown label="Tags" options={tagOptions} selected={selectedTags} onChange={setSelectedTags} mode="multi" includeAllOption />
          <input className="whimsy-form-control filter-bar-search" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
          <MultiCheckDropdown label="Edit Columns" options={COLUMN_DEFINITIONS} selected={visibleColumns} onChange={setVisibleColumns} mode="multi" />
          <Form.Select className="filter-bar-select" style={{ width: '160px' }} value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="none">No Grouping</option>
            <option value="media">Group by Type</option>
            <option value="status">Group by Status</option>
          </Form.Select>
        </div>
      </div>

      <Container className="mt-3">
        <div className="whimsy-table-container">
          <div className="whimsy-table-wrapper">
            <table className="table whimsy-table table-striped table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th className="sortable-header" onClick={() => handleSort('title')}>Title{arrow('title')}</th>
                  {activeColumns.map((c) => (
                    <th key={c.key} className="sortable-header" onClick={() => handleSort(c.key)}>
                      {c.key === 'friendRating' ? friendRatingLabel : c.label}{arrow(c.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let lastGroup;
                  return paginated.map((item) => {
                    const g = groupValue(item);
                    const showHeader = groupBy !== 'none' && g !== lastGroup;
                    lastGroup = g;
                    return (
                      <React.Fragment key={item.id}>
                        {showHeader && (
                          <tr className="whimsy-group-header">
                            <td colSpan={2 + activeColumns.length}>{cap(g)}</td>
                          </tr>
                        )}
                        <tr onClick={() => navigate(`/${item.media}/${item.id.split('/').slice(1).join('/')}`)}>
                          <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                          <td>{item.title}</td>
                          {activeColumns.map((c) => (
                            <td key={c.key} onClick={c.key === 'tags' ? (e) => e.stopPropagation() : undefined}>{renderCell(c.key, item)}</td>
                          ))}
                        </tr>
                      </React.Fragment>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
          {paginated.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No items match your filters.</p>}
        </div>

        {sorted.length > 0 && (
          <div className="d-flex justify-content-center my-3">
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span className="align-self-center">Page {page} of {totalPages}</span>
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default FriendListTable;