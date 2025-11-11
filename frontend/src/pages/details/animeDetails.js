
// src/pages/searchs/AnimeDetail.js
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

/**
 *  Search for Album with backend call
 */
const fetchAnimeDetails = async (id) => {
  return await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
};

/**
 *  Extract the specific details for the media
 */
const extractAnimeDetails = (data) => {
  const anime = data.data;
  return {
    image: anime.images.jpg.image_url || 'placeholder.jpg',
    title: anime.title, // Ensure title is included
    details: [
      <p><strong>Episodes:</strong> {anime.episodes}</p>,
      <p><strong>Status:</strong> {anime.status}</p>,
      <p><strong>Released in:</strong> {anime.year}</p>,
      <p><strong>Genres/Themes:</strong> {anime.genres?.map(genre => genre.name).join(', ')} {anime.themes?.map(theme => theme.name).join(', ')} </p>,
    ],
    summary: <p> {anime.background}  {anime.synopsis} </p>
  };
};

/**
 *  Put out the data to then detail page
 */
const AnimeDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchAnimeDetails}
      extractDetails={extractAnimeDetails} // Corrected prop name
      mediaType="anime"
      tokenRequired={false} // No token required
    />
  );
};

export default AnimeDetail;
