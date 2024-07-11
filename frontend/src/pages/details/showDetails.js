
// src/pages/details/ShowDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

const fetchShowDetails = async (id) => {
  return await axios.get(`https://api.tvmaze.com/shows/${id}`);
};

const extractShowDetails = (data) => {
  const show = data;
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText;
  };

  return {
    image: show.image?.original || 'placeholder.jpg',
    title: show.name, // Ensure title is included
    details: (
      <>
        <p><strong>Language:</strong> {show.language}</p>
        <p><strong>Status:</strong> {show.status}</p>
        <p><strong>Genres:</strong> {show.genres.join(', ')}</p>
        <p><strong>Summary:</strong> {stripHtmlTags(show.summary)}</p>
      </>
    )
  };
};

const ShowDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchShowDetails}
      extractDetails={extractShowDetails} // Corrected prop name
      mediaType="show" // Singular to match API and page context
      tokenRequired={false} // No token required
    />
  );
};

export default ShowDetail;











