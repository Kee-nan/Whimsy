// src/pages/details/ShowDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import { Button } from 'react-bootstrap';

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${id}`);
        setShow(response.data);
      } catch (error) {
        console.error("Error fetching show details:", error);
      }
    };

    fetchShowDetails();
  }, [id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const showItem = {
      url: `shows/${id}`,
      title: show.name,
      image: show.image?.original || 'placeholder.jpg',
    };
    localStorage.setItem('watchlist', JSON.stringify([...watchlist, showItem]));
  };

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText;
  };

  if (!show) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={show.image?.original || 'placeholder.jpg'}
        title={show.name}
        details={
          <>
            <p><strong>URL:</strong> <a href={show.url} target="_blank" rel="noopener noreferrer">View on TVMaze</a></p>
            <p><strong>Status:</strong> {show.status}</p>
            <p><strong>Premiered - Ended:</strong> {show.premiered}    --{'>'}   {show.ended}</p>
            <p><strong>Summary:</strong> {stripHtmlTags(show.summary)}</p>
          </>
        }
        buttons={<Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>}
      />
    </>
  );
};

export default ShowDetail;



