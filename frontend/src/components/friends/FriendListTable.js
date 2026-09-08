import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TagsCell from '../lists/TagsCell';

const PAGE_SIZE = 50;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Mirrors the Lists page's table view, but for viewing a specific
 * friend's media — filters/sort/pagination work the same way, and the
 * "rating" column is labeled with the friend's name since it shows
 * their personal rating, not an aggregate.
 */
const FriendListTable = ({ friendId, friendUsername }) => {
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [mediaFilter, setMediaFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('loggedAt');
  const [sortDir, setSortDir] = useState('desc');
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

  const filtered = useMemo(() => items.filter((item) =>
    (statusFilter === 'All' || item.status === statusFilter) &&
    (mediaFilter === 'All' || item.media === mediaFilter) &&
    (!search || item.title.toLowerCase().includes(search.toLowerCase()))
  ), [items, statusFilter, mediaFilter, search]);

  const getSortValue = (item, key) => {
    switch (key) {
      case 'friendRating': return item.friendRating ?? -1;
      case 'globalRating': return item.globalRating ?? -1;
      case 'externalRating': return item.externalRating ?? -1;
      case 'loggedAt': return item.loggedAt ? new Date(item.loggedAt).getTime() : 0;
      default: return item[key] ?? '';
    }
  };

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = getSortValue(a, sortColumn), vb = getSortValue(b, sortColumn);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortColumn, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortColumn === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortColumn(key); setSortDir('desc'); }
  };
  const arrow = (key) => (sortColumn === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <div>
      <div className="whimsy-search-bar py-3">
        <div className="whimsy-search-form d-flex align-items-center gap-2 flex-wrap">
          <select className="form-select" style={{ width: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="current">Current</option>
            <option value="completed">Completed</option>
            <option value="futures">Futures</option>
          </select>
          <select className="form-select" style={{ width: '160px' }} value={mediaFilter} onChange={(e) => setMediaFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="movie">Movie</option><option value="show">Show</option>
            <option value="anime">Anime</option><option value="manga">Manga</option>
            <option value="book">Book</option><option value="game">Game</option><option value="album">Album</option>
          </select>
          <input className="whimsy-form-control" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="whimsy-table-container">
        <div className="whimsy-table-wrapper">
          <table className="table whimsy-table table-striped table-hover">
            <thead>
              <tr>
                <th>Image</th><th>Title</th>
                <th className="sortable-header" onClick={() => handleSort('status')}>Status{arrow('status')}</th>
                <th className="sortable-header" onClick={() => handleSort('friendRating')}>{friendUsername}'s Rating{arrow('friendRating')}</th>
                <th className="sortable-header" onClick={() => handleSort('globalRating')}>Whimsy Rating{arrow('globalRating')}</th>
                <th className="sortable-header" onClick={() => handleSort('externalRating')}>Source Rating{arrow('externalRating')}</th>
                <th className="sortable-header" onClick={() => handleSort('loggedAt')}>Date Logged{arrow('loggedAt')}</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id} onClick={() => navigate(`/${item.media}/${item.id.split('/').slice(1).join('/')}`)}>
                  <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                  <td>{item.title}</td>
                  <td>{cap(item.status)}</td>
                  <td>{item.friendRating != null ? `${item.friendRating}/30` : '—'}</td>
                  <td>{item.globalRating != null ? `${item.globalRating}/30 (${item.globalRatingCount})` : '—'}</td>
                  <td>{item.externalRating != null ? `${item.externalRating}/30` : '—'}</td>
                  <td>{item.loggedAt ? new Date(item.loggedAt).toLocaleDateString() : '—'}</td>
                  <td onClick={(e) => e.stopPropagation()}><TagsCell tags={item.tags} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No items match.</p>}
      </div>

      {sorted.length > 0 && (
        <div className="d-flex justify-content-center my-3">
          <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span className="align-self-center">Page {page} of {totalPages}</span>
          <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default FriendListTable;