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

  // Performs a search
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchKey);
  };

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

  // This hook is used to preload a query if we are getting to this page from the back button of a detail page
  useEffect(() => {
    if (location.state?.searchKey) {
      performSearch(location.state.searchKey);
    }
  }, [location.state, performSearch]);

  // Clears the grid cards from the query
  const clearResults = () => {
    setResults([]);
  };

  //Navigates to the detail page of the card we click on
  const handleCardClick = (id) => {
    const currentState = {
      searchKey,
      searchResults: results,
      origin: 'search' // Add origin to state
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



