//lists.js
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ListCard from '../components/lists/ListCard';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchAndDropdowns from '../components/lists/ListFilter';
import CSVImportModal from '../components/lists/CSVImportModal';
import '../styles/tableStyles.css';
import { checkTokenExpiration } from '../utils/checkTokenExpiration';

const Lists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [isTableView, setIsTableView] = useState(false);
  const [user, setUser] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 30;

  // control our import modal visibility
  const [importModalShow, setImportModalShow] = useState(false);

  // Variables that will be loaded from the user account that will be filtered
  const [lists, setLists] = useState({
    completed: [],
    futures: [],
    current: [],
  });

  // Initialized as an empty array for Review Data
  const [ReviewData, setReviewData] = useState([]);
  
  // Go and Fetch the lists and reviews from backend
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching user + lists...');

      if (checkTokenExpiration(navigate)) return;
      const token = localStorage.getItem('user_token');
      if (!token) return console.error('no user token');
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      try {
        const res = await fetch('http://localhost:5000/api/list/lists', { headers });
        const data = await res.json();
        setLists(data);

        const userRes = await fetch('http://localhost:5000/api/accounts/user', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          console.log('Fetched user data:', userData);
          setUser(userData);
          setIsTableView(userData.view_setting === 'table');
        }

        const rev = await fetch('http://localhost:5000/api/list/reviews', { headers });
        setReviewData(rev.ok ? await rev.json() : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * FILTER DETAILS 
   */
  const [currentList, setCurrentList] = useState('current');
  const [currentMedia, setCurrentMedia] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter by media type & search term
  const filterList = (list) => {
    return list.filter(item => {
      const matchesMedia = currentMedia === 'All' || item.media === currentMedia;
      const matchesSearch = item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMedia && matchesSearch;
    });
  };

  // compute filtered and paginated list
  const filteredList = filterList(
    currentList === 'completed'
      ? lists.completed
      : currentList === 'futures'
      ? lists.futures
      : lists.current
  );

  const totalItems = filteredList.length;
  const lastVisiblePage = Math.ceil(totalItems / pageSize);

  const paginatedList = filteredList.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [currentList, currentMedia, searchTerm, location.state]);

  // Dropdown handlers
  const handleSelectList = (listName) => {
    setCurrentList(listName);
  };

  const handleSelectMedia = (mediaType) => {
    setCurrentMedia(mediaType);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //Function to take you to details when you click on an item
  const handleNavigate = (id) => {
    const currentState = {
      currentList,
      currentMedia,
      searchTerm,
      origin: 'list' // Add origin to state
    };
    navigate(`/${id}`, { state: currentState });
  };

  function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Import and Export Buttons
   */
  const handleExportCSV = () => {
    const allItems = [...lists.completed, ...lists.current, ...lists.futures];
  
    if (allItems.length === 0) {
      alert("No list items to export.");
      return;
    }
  
    const headers = ['id', 'media', 'title', 'image', 'listType', 'rating'];
    const csvRows = [headers.join(',')];
  
    for (const item of allItems) {
      const review = ReviewData.find(r => r.id === item.id);
      const rating = review ? review.rating : '-';
  
      const row = headers.map(header => {
        if (header === 'rating') return `"${rating}"`;
        const value = item[header] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
  
      csvRows.push(row);
    }
  
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_media_lists.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Renderers
  const renderList = (list) => (
    <div className="row">
      {list.map((item, index) => (
        <div className="col-md-4 mb-4" key={index}>
          <ListCard
            item={item}
            onNavigate={handleNavigate}
            type={item.type}
            reviewData={ReviewData}
          />
        </div>
      ))}
    </div>
  );

  const renderTable = (list) => (
    <div className="whimsy-table-container">
      <div className="whimsy-table-wrapper">
        <table className="table whimsy-table table-striped table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Media Type</th>
              <th>User Rating</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => {
              const review = ReviewData.find(r => r.id === `${item.id}`);
              return (
                <tr key={index} onClick={() => handleNavigate(item.id)}>
                  <td><img src={item.image} alt={item.title} /></td>
                  <td>{item.title}</td>
                  <td>{item.media}</td>
                  <td>{review ? review.rating : '—'}</td>
                  <td>{item.id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <AppNavbar />

      <SearchAndDropdowns
        currentList={currentList}
        currentMedia={currentMedia}
        searchTerm={searchTerm}
        onListChange={handleSelectList}
        onMediaChange={handleSelectMedia}
        onSearchChange={handleSearchChange}
        capitalizeFirstLetter={capitalizeFirstLetter}
        onExportClick={handleExportCSV}
        onImportClick={() => setImportModalShow(true)}
        isTableView={isTableView}
        setIsTableView={setIsTableView}
      />

      <CSVImportModal
        show={importModalShow}
        onHide={() => setImportModalShow(false)}
        onImportDone={count => {
          console.log(`${count} items imported`);
          setImportModalShow(false);
        }}
      />

      <Container className="mt-5">
        <div style={{ minHeight: '300px', position: 'relative' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : isTableView ? (
            renderTable(paginatedList)
          ) : (
            renderList(paginatedList)
          )}
        </div>

        {/* 🔹 Pagination Controls */}
        {totalItems > 0 && (
          <div className="d-flex justify-content-center my-3">
            <button
              className="btn btn-secondary mx-2"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              ← Prev
            </button>

            <span className="align-self-center">
              Page {page} of {lastVisiblePage}
            </span>

            <button
              className="btn btn-secondary mx-2"
              disabled={page >= lastVisiblePage}
              onClick={() => setPage(p => Math.min(lastVisiblePage, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </Container>
    </>
  );
};

export default Lists;








