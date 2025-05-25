import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import TableView from '../../components/TableViewSearch';

const SearchPage = ({ searchFunction, renderCard, placeholder, extractId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchKey, setSearchKey] = useState(location.state?.searchKey || '');
  const [results, setResults] = useState([]);
  const [isTableView, setIsTableView] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Fetch user and apply their view_setting
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user_token = localStorage.getItem('user_token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
        };

        const response = await axios.get('http://localhost:5000/api/accounts/user', { headers });

        if (response.status !== 200) {
          throw new Error('Error fetching user details');
        }

        const userData = response.data;
        setUser(userData);
        setIsTableView(userData.view_setting === 'table'); // ✅ set based on preference
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsTableView(false); // fallback
      }
    };

    fetchUserDetails();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchKey);
  };

  const performSearch = useCallback(async (key) => {
    try {
      const response = await searchFunction(key);
      setResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(`Error fetching ${placeholder}:`, error);
      setResults([]);
    }
  }, [searchFunction, placeholder]);

  useEffect(() => {
    if (location.state?.searchKey) {
      performSearch(location.state.searchKey);
    }
  }, [location.state, performSearch]);

  const clearResults = () => {
    setResults([]);
  };

  const handleCardClick = (id) => {
    const currentState = {
      searchKey,
      searchResults: results,
      origin: 'search',
    };
    navigate(`/${placeholder.toLowerCase()}/${id}`, { state: currentState });
  };

  return (
    <>
      <AppNavbar />

      <SearchBar
        placeholder={`Search for ${placeholder}...`}
        searchFunction={handleSearch}
        clearFunction={clearResults}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        isTableView={isTableView}
        setIsTableView={setIsTableView} // will be used by the dropdown
      />

      {isTableView ? (
        <TableView
          items={results.map(item => ({ ...item, id: extractId(item) }))}
          onRowClick={handleCardClick}
          placeholder={placeholder}
        />
      ) : (
        <GridCard
          items={results.map(item => ({ ...item, id: extractId(item) }))}
          renderItem={renderCard}
          onCardClick={handleCardClick}
        />
      )}
    </>
  );
};

export default SearchPage;






