import { Card } from 'react-bootstrap';
import { createSearchFunction, createFetchDetails } from './mediaSearch';

const renderers = {
  movie: (item) => (
    <>
      <Card.Img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="grid-card-image poster" />
      <Card.Body><Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title></Card.Body>
    </>
  ),
  show: (item) => (
    <>
      <Card.Img src={item.image?.medium || 'placeholder.jpg'} alt={item.name} className="grid-card-image poster" />
      <Card.Body><Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title></Card.Body>
    </>
  ),
  anime: (item) => (
    <>
      <Card.Img src={item.images.jpg.image_url} alt={item.title} className="grid-card-image poster" />
      <Card.Body><Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title></Card.Body>
    </>
  ),
  manga: (item) => (
    <>
      <Card.Img src={item.images.jpg.image_url} alt={item.title} className="grid-card-image poster" />
      <Card.Body><Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title></Card.Body>
    </>
  ),
  book: (item) => (
    <>
      <Card.Img src={item.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'} alt={item.volumeInfo.title} className="grid-card-image poster" />
      <Card.Body><Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.volumeInfo.title}</Card.Title></Card.Body>
    </>
  ),
  game: (item) => (
    <>
      <Card.Img src={item.background_image} alt={item.name} className="grid-card-image album" />
      <Card.Body><Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title></Card.Body>
    </>
  ),
  album: (item) => (
    <>
      <Card.Img src={item.images?.[0]?.url || 'placeholder.jpg'} alt={item.name} className="grid-card-image album" />
      <Card.Body>
        <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title>
        <Card.Text style={{ color: 'white' }}>{item.artists?.map(a => a.name).join(', ')}</Card.Text>
      </Card.Body>
    </>
  ),
};

const extractIds = {
  movie: (item) => item.id,
  show: (item) => item.id,
  anime: (item) => item.mal_id,
  manga: (item) => item.mal_id,
  book: (item) => item.id,
  game: (item) => item.id,
  album: (item) => item.id,
};

export const MEDIA_TYPES = [
  { key: 'movie', label: 'Movies' },
  { key: 'show', label: 'Shows' },
  { key: 'anime', label: 'Anime' },
  { key: 'manga', label: 'Manga' },
  { key: 'book', label: 'Books' },
  { key: 'game', label: 'Games' },
  { key: 'album', label: 'Albums' },
];

/**
 * The `placeholder` value here must stay singular/lowercase-matchable —
 * SearchPage.js's handleCardClick does navigate(`/${placeholder.toLowerCase()}/${id}`),
 * which needs to land on the existing per-type detail routes (/movie/:id,
 * /anime/:id, ...) that are completely unchanged by this refactor.
 */
export function getMediaTypeConfig(mediaType) {
  const meta = MEDIA_TYPES.find(t => t.key === mediaType);
  return {
    searchFunction: createSearchFunction(mediaType),
    fetchDetails: createFetchDetails(mediaType),
    renderCard: renderers[mediaType],
    extractId: extractIds[mediaType],
    placeholder: meta ? meta.label.replace(/s$/, '') : mediaType,
  };
}