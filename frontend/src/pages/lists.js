import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Container, Spinner, Dropdown, Form } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ListCard from '../components/lists/ListCard';
import FriendAvatarStack from '../components/lists/FriendAvatarStack';
import TagsCell from '../components/lists/TagsCell';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchAndDropdowns from '../components/lists/ListFilter';
import CSVImportModal from '../components/lists/CSVImportModal';
import '../styles/tableStyles.css';
import { checkTokenExpiration } from '../utils/checkTokenExpiration';

const COLUMN_DEFINITIONS = [
  { key: 'media', label: 'Type' },
  { key: 'status', label: 'List Status' },
  { key: 'yourRating', label: 'Your Rating' },
  { key: 'friendRating', label: 'Friend Rating' },
  { key: 'globalRating', label: 'Whimsy Rating' },
  { key: 'externalRating', label: 'Source Rating' },
  { key: 'loggedAt', label: 'Date Logged' },
  { key: 'friendsWithItem', label: 'Friends' },
  { key: 'tags', label: 'Tags' },
  { key: 'siteCompletedCount', label: '# Completed (Site)' },
  { key: 'siteWatchlistCount', label: '# On Watchlist (Site)' },
  { key: 'siteCurrentCount', label: '# In-Progress (Site)' },
  { key: 'siteFavoritedCount', label: '# Favorited (Site)' },
  { key: 'siteWrittenReviewCount', label: '# Written Reviews' },
];

const DEFAULT_VISIBLE_COLUMNS = ['media', 'status', 'yourRating', 'friendRating', 'globalRating', 'loggedAt', 'friendsWithItem', 'tags'];
const COLUMN_STORAGE_KEY = 'whimsy_list_columns_v2';
const PAGE_SIZE = 50;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const loadColumnPrefs = () => {
  try {
    const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* corrupt storage — fall through to defaults */ }
  return DEFAULT_VISIBLE_COLUMNS;
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

const Lists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isTableView, setIsTableView] = useState(false);
  const [page, setPage] = useState(1);
  const [importModalShow, setImportModalShow] = useState(false);

  const [lists, setLists] = useState({ completed: [], futures: [], current: [] });
  const [detailedItems, setDetailedItems] = useState([]);
  const [ReviewData, setReviewData] = useState([]);
  const [tagsByItemId, setTagsByItemId] = useState({});
  const [customLists, setCustomLists] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState(loadColumnPrefs());
  const [selectedStatuses, setSelectedStatuses] = useState(['current']);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState(['All']);
  const [mediaMultiMode, setMediaMultiMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');

  // sorting + grouping (table view only)
  const [sortColumn, setSortColumn] = useState('loggedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [groupBy, setGroupBy] = useState('none'); // 'none' | 'media' | 'status'

  // extra quick filters
  const [ratedOnly, setRatedOnly] = useState(false);
  const [friendsLoggedOnly, setFriendsLoggedOnly] = useState(false);

  const fetchAll = useCallback(async () => {
    if (checkTokenExpiration(navigate)) return;
    const headers = authHeaders();
    try {
      const [listsRes, detailedRes, userRes, reviewsRes, tagsRes, customListsRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/list/lists`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/list/lists/detailed`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/accounts/user`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/list/reviews`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/tags-map`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists`, { headers }),
      ]);
      setLists(await listsRes.json());
      if (detailedRes.ok) setDetailedItems(await detailedRes.json());
      if (userRes.ok) setIsTableView((await userRes.json()).view_setting === 'table');
      setReviewData(reviewsRes.ok ? await reviewsRes.json() : []);
      if (tagsRes.ok) setTagsByItemId(await tagsRes.json());
      if (customListsRes.ok) setCustomLists(await customListsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const tagOptions = useMemo(() => customLists.map((l) => ({ key: String(l.id), label: l.name })), [customLists]);

  const matchesStatus = useCallback((status) =>
    selectedStatuses.includes('All') || selectedStatuses.length === 0 || selectedStatuses.includes(status),
  [selectedStatuses]);

  const matchesMedia = useCallback((media) =>
    selectedMediaTypes.includes('All') || selectedMediaTypes.length === 0 || selectedMediaTypes.includes(media),
  [selectedMediaTypes]);

  const matchesTags = useCallback((itemId) => {
    if (selectedTags.includes('All') || selectedTags.length === 0) return true;
    const itemTags = tagsByItemId[itemId] || [];
    return selectedTags.some((tagId) => itemTags.some((t) => String(t.id) === tagId));
  }, [selectedTags, tagsByItemId]);

  const matchesSearch = useCallback((title) =>
    !searchTerm || (title && title.toLowerCase().includes(searchTerm.toLowerCase())),
  [searchTerm]);

  const matchesQuickFilters = useCallback((item) => {
    if (ratedOnly && item.yourRating == null) return false;
    if (friendsLoggedOnly && (!item.friendsWithItem || item.friendsWithItem.length === 0)) return false;
    return true;
  }, [ratedOnly, friendsLoggedOnly]);

  const combinedCardItems = useMemo(() => ([
    ...lists.completed.map((i) => ({ ...i, status: 'completed' })),
    ...lists.current.map((i) => ({ ...i, status: 'current' })),
    ...lists.futures.map((i) => ({ ...i, status: 'futures' })),
  ]), [lists]);

  const filteredCardItems = useMemo(() => combinedCardItems.filter((item) =>
    matchesStatus(item.status) && matchesMedia(item.media) && matchesTags(item.id) && matchesSearch(item.title)
  ), [combinedCardItems, matchesStatus, matchesMedia, matchesTags, matchesSearch]);

  const filteredDetailed = useMemo(() => detailedItems.filter((item) =>
    matchesStatus(item.status) && matchesMedia(item.media) && matchesTags(item.id) &&
    matchesSearch(item.title) && matchesQuickFilters(item)
  ), [detailedItems, matchesStatus, matchesMedia, matchesTags, matchesSearch, matchesQuickFilters]);

  const getSortValue = useCallback((item, key) => {
    switch (key) {
      case 'title': return (item.title || '').toLowerCase();
      case 'media': return item.media;
      case 'status': return item.status;
      case 'yourRating': return item.yourRating ?? -1;
      case 'friendRating': return item.friendRating ?? -1;
      case 'globalRating': return item.globalRating ?? -1;
      case 'externalRating': return item.externalRating ?? -1;
      case 'loggedAt': return item.loggedAt ? new Date(item.loggedAt).getTime() : 0;
      case 'friendsWithItem': return (item.friendsWithItem || []).length;
      case 'tags': return (tagsByItemId[item.id] || []).map((t) => t.name).sort().join(',');
      default: return item[key] ?? 0;
    }
  }, [tagsByItemId]);

  const groupValue = useCallback((item) => (groupBy === 'media' ? item.media : groupBy === 'status' ? item.status : null), [groupBy]);

  const sortedDetailed = useMemo(() => {
    const arr = [...filteredDetailed];
    arr.sort((a, b) => {
      if (groupBy !== 'none') {
        const ga = groupValue(a), gb = groupValue(b);
        if (ga !== gb) return ga < gb ? -1 : 1; // groups always sort alphabetically
      }
      const va = getSortValue(a, sortColumn);
      const vb = getSortValue(b, sortColumn);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredDetailed, sortColumn, sortDir, groupBy, groupValue, getSortValue]);

  const totalItems = (isTableView ? sortedDetailed : filteredCardItems).length;
  const lastVisiblePage = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const paginatedCardItems = filteredCardItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const paginatedDetailed = sortedDetailed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [selectedStatuses, selectedMediaTypes, selectedTags, searchTerm, ratedOnly, friendsLoggedOnly, groupBy, location.state, isTableView]);

  const handleNavigate = (id) => navigate(`/${id}`, {
    state: { currentList: selectedStatuses, currentMedia: selectedMediaTypes, searchTerm, origin: 'list' },
  });

  const handleSort = (key) => {
    if (sortColumn === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortColumn(key); setSortDir('asc'); }
  };

  const sortIndicator = (key) => (sortColumn === key ? <span className="whimsy-table-sort-icon">{sortDir === 'asc' ? '▲' : '▼'}</span> : null);

  const handleExportCSV = () => {
    const allItems = [
      ...lists.completed.map((item) => ({ ...item, listType: 'completed' })),
      ...lists.current.map((item) => ({ ...item, listType: 'current' })),
      ...lists.futures.map((item) => ({ ...item, listType: 'futures' })),
    ];
    if (allItems.length === 0) return alert('No list items to export.');
    const headers = ['id', 'media', 'title', 'image', 'listType', 'rating'];
    const csvRows = [headers.join(',')];
    for (const item of allItems) {
      const review = ReviewData.find((r) => r.id === item.id);
      const rating = review ? review.rating : '-';
      csvRows.push(headers.map((h) => h === 'rating' ? `"${rating}"` : `"${String(item[h] || '').replace(/"/g, '""')}"`).join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_media_lists.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleColumnChange = (newSelected) => {
    setVisibleColumns(newSelected);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(newSelected));
  };

  const renderCell = (key, item) => {
    switch (key) {
      case 'media': return item.media;
      case 'status': return cap(item.status);
      case 'yourRating': return item.yourRating != null ? `${item.yourRating}/30` : '—';
      case 'friendRating': return item.friendRating != null ? `${item.friendRating}/30 (${item.friendRatingCount})` : '—';
      case 'globalRating': return item.globalRating != null ? `${item.globalRating}/30 (${item.globalRatingCount})` : '—';
      case 'externalRating': return item.externalRating != null ? `${item.externalRating}/30` : '—';
      case 'loggedAt': return item.loggedAt ? new Date(item.loggedAt).toLocaleDateString() : '—';
      case 'friendsWithItem': return <FriendAvatarStack friends={item.friendsWithItem} />;
      case 'tags': return <TagsCell tags={tagsByItemId[item.id]} />;
      default: return item[key];
    }
  };

  const activeColumns = COLUMN_DEFINITIONS.filter((c) => visibleColumns.includes(c.key));

  return (
    <>
      <AppNavbar />
      <SearchAndDropdowns
        selectedStatuses={selectedStatuses} onStatusChange={setSelectedStatuses}
        selectedMediaTypes={selectedMediaTypes} onMediaChange={setSelectedMediaTypes}
        mediaMultiMode={mediaMultiMode} onToggleMediaMultiMode={setMediaMultiMode}
        tagOptions={tagOptions} selectedTags={selectedTags} onTagsChange={setSelectedTags}
        searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)}
        isTableView={isTableView} setIsTableView={setIsTableView}
        onExportClick={handleExportCSV} onImportClick={() => setImportModalShow(true)}
        columnOptions={COLUMN_DEFINITIONS} visibleColumns={visibleColumns} onToggleColumn={handleColumnChange}
      />

      <CSVImportModal show={importModalShow} onHide={() => setImportModalShow(false)} onImportDone={() => { setImportModalShow(false); fetchAll(); }} />

      {isTableView && (
        <Container>
          <div className="d-flex justify-content-between align-items-center my-2 flex-wrap gap-2">
            <div className="d-flex gap-3 flex-wrap">
              <Form.Check type="checkbox" label="Rated only" checked={ratedOnly} onChange={(e) => setRatedOnly(e.target.checked)} />
              <Form.Check type="checkbox" label="Friends have logged this" checked={friendsLoggedOnly} onChange={(e) => setFriendsLoggedOnly(e.target.checked)} />
            </div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ color: '#999', fontSize: '0.9rem' }}>Group by:</span>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" size="sm">
                  {groupBy === 'none' ? 'None' : groupBy === 'media' ? 'Media Type' : 'List Status'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setGroupBy('none')}>None</Dropdown.Item>
                  <Dropdown.Item onClick={() => setGroupBy('media')}>Media Type</Dropdown.Item>
                  <Dropdown.Item onClick={() => setGroupBy('status')}>List Status</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      )}

      <Container className="mt-3">
        <div style={{ minHeight: '300px', position: 'relative' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100"><Spinner animation="border" variant="primary" /></div>
          ) : isTableView ? (
            <div className="whimsy-table-container">
              <div className="whimsy-table-wrapper">
                <table className="table whimsy-table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th onClick={() => handleSort('title')} className="sortable-header">Title {sortIndicator('title')}</th>
                      {activeColumns.map((c) => (
                        <th key={c.key} onClick={() => handleSort(c.key)} className="sortable-header">
                          {c.label} {sortIndicator(c.key)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let lastGroup;
                      return paginatedDetailed.map((item) => {
                        const g = groupValue(item);
                        const showHeader = groupBy !== 'none' && g !== lastGroup;
                        lastGroup = g;
                        return (
                          <React.Fragment key={item.id}>
                            {showHeader && (
                              <tr className="whimsy-group-header">
                                <td colSpan={2 + activeColumns.length}>
                                  {cap(g)} ({sortedDetailed.filter((x) => groupValue(x) === g).length})
                                </td>
                              </tr>
                            )}
                            <tr onClick={() => handleNavigate(item.id)}>
                              <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                              <td>{item.title}</td>
                              {activeColumns.map((c) => (
                                <td key={c.key} onClick={(c.key === 'friendsWithItem' || c.key === 'tags') ? (e) => e.stopPropagation() : undefined}>
                                  {renderCell(c.key, item)}
                                </td>
                              ))}
                            </tr>
                          </React.Fragment>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
              {paginatedDetailed.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No items match your filters.</p>}
            </div>
          ) : (
            <div className="row">
              {paginatedCardItems.map((item, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <ListCard item={item} onNavigate={handleNavigate} type={item.media} reviewData={ReviewData} />
                </div>
              ))}
              {paginatedCardItems.length === 0 && <p style={{ color: '#999' }}>No items match your filters.</p>}
            </div>
          )}
        </div>

        {totalItems > 0 && (
          <div className="d-flex justify-content-center my-3">
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Prev</button>
            <span className="align-self-center">Page {page} of {lastVisiblePage}</span>
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page >= lastVisiblePage} onClick={() => setPage((p) => Math.min(lastVisiblePage, p + 1))}>Next →</button>
          </div>
        )}
      </Container>
    </>
  );
};

export default Lists;






