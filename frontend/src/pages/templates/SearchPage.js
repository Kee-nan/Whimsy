import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';

const SearchPage = ({ searchFunction, renderCard, placeholder, extractId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKey, setSearchKey] = useState(location.state?.searchKey || "");
  const [results, setResults] = useState([]);

  const performSearch = useCallback(async (key) => {
    try {
      const response = await searchFunction(key);
      console.log('Search results:', response.data); // Debugging line
      setResults(Array.isArray(response.data) ? response.data : []); // Ensure results is an array
    } catch (error) {
      console.error(`Error fetching ${placeholder}:`, error);
      setResults([]); // Set to empty array on error
    }
  }, [searchFunction, placeholder]);

  useEffect(() => {
    if (location.state?.searchKey) {
      performSearch(location.state.searchKey);
    }
  }, [location.state, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchKey);
  };

  const clearResults = () => {
    setResults([]);
  };

  const handleCardClick = (id) => {
    //const id = extractId(item);
    const currentState = {
      searchKey,
      searchResults: results
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
      />
      <GridCard
        items={Array.isArray(results) ? results.map(item => ({ ...item, id: extractId(item) })) : []}
        renderItem={renderCard}
        onCardClick={handleCardClick}
      />
    </>
  );
};

export default SearchPage;



