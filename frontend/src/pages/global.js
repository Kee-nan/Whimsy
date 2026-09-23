import React, { useEffect, useState } from 'react';
import { Container, Form, OverlayTrigger, Tooltip, Dropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

const PAGE_SIZE = 25;

const MEDIA_OPTIONS = [
  { value: 'All', label: 'All Types' },
  { value: 'movie', label: 'Movies' }, { value: 'show', label: 'Shows' },
  { value: 'anime', label: 'Anime' }, { value: 'manga', label: 'Manga' },
  { value: 'book', label: 'Books' }, { value: 'game', label: 'Games' }, { value: 'album', label: 'Albums' },
];
const SORT_OPTIONS = [
  { value: 'whimsy', label: 'Sort: Whimsy Rating' },
  { value: 'external', label: 'Sort: Source Rating' },
  { value: 'user', label: 'Sort: Your Rating' },
  { value: 'friends', label: 'Sort: Friend Rating' },
];

const Global = () => {
  const [rows, setRows] = useState([]);
  const [mediaFilter, setMediaFilter] = useState('All');
  const [sortBy, setSortBy] = useState('whimsy');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      const token = localStorage.getItem('user_token');
      const params = new URLSearchParams({ sortBy });
      if (mediaFilter !== 'All') params.append('mediaType', mediaFilter);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/global/top-rated?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setRows(await res.json());
      setLoading(false);
      setPage(1);
    };
    fetchTopRated();
  }, [mediaFilter, sortBy]);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE) || 1;
  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const renderFriendCell = (item) => {
    if (item.friendRating == null) return '—';
    const tooltip = item.friendContributors.map((c) => `${c.username} (${c.rating})`).join(', ');
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
        <span style={{ cursor: 'help', borderBottom: '1px dotted #999' }}>{item.friendRating}/30</span>
      </OverlayTrigger>
    );
  };

  return (
    <>
      <AppNavbar />
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <h4 className="filter-bar-title">Global Leaderboard — Top 100</h4>
         <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn">
            {MEDIA_OPTIONS.find((o) => o.value === mediaFilter)?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {MEDIA_OPTIONS.map((o) => (
              <Dropdown.Item key={o.value} onClick={() => setMediaFilter(o.value)}>{o.label}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn">
            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {SORT_OPTIONS.map((o) => (
              <Dropdown.Item key={o.value} onClick={() => setSortBy(o.value)}>{o.label}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        </div>
      </div>

      <Container className="mt-4">
        <div className="whimsy-table-container">
          <div className="whimsy-table-wrapper">
            <table className="table whimsy-table table-striped table-hover">
              <thead>
                <tr>
                  <th>Rank</th><th>Image</th><th>Title</th><th>Type</th>
                  <th className={`sortable-header ${sortBy === 'whimsy' ? 'sorted-col' : ''}`} onClick={() => setSortBy('whimsy')}>
                    Whimsy Rating {sortBy === 'whimsy' && '▼'}
                  </th>
                  <th className={`sortable-header ${sortBy === 'external' ? 'sorted-col' : ''}`} onClick={() => setSortBy('external')}>
                    Source Rating {sortBy === 'external' && '▼'}
                  </th>
                  <th className={`sortable-header ${sortBy === 'user' ? 'sorted-col' : ''}`} onClick={() => setSortBy('user')}>
                    Your Rating {sortBy === 'user' && '▼'}
                  </th>
                  <th className={`sortable-header ${sortBy === 'friends' ? 'sorted-col' : ''}`} onClick={() => setSortBy('friends')}>
                    Friend Rating {sortBy === 'friends' && '▼'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ color: '#999', padding: '2rem' }}>Loading...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={8} style={{ color: '#999', padding: '2rem' }}>No rated media yet for this filter.</td></tr>
                ) : (
                  paginated.map((item) => (
                    <tr key={item.id} onClick={() => navigate(`/${item.media}/${item.id.split('/').slice(1).join('/')}`)}>
                      <td>{item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : `#${item.rank}`}</td>
                      <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                      <td>{item.title}</td>
                      <td>{item.media}</td>
                      <td>{item.whimsyRating != null ? `${item.whimsyRating}/30 (${item.whimsyRatingCount})` : '—'}</td>
                      <td>{item.externalRating != null ? `${item.externalRating}/30` : '—'}</td>
                      <td>{item.userRating != null ? `${item.userRating}/30` : '—'}</td>
                      <td onClick={(e) => e.stopPropagation()}>{renderFriendCell(item)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="pagination-container">
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span className="align-self-center">Page {page} of {totalPages}</span>
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </Container>
    </>
  );
};

export default Global;