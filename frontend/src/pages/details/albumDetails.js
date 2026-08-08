// frontend/src/pages/details/albumDetails.js
import DetailPage from '../templates/DetailPage';
import { createFetchDetails } from '../../utils/mediaSearch';

const fetchAlbumDetails = createFetchDetails('album');

const extractAlbumDetails = (album) => {
  if (!album) return { title: 'Unknown Album', image: 'placeholder.jpg', details: <p>Error loading album.</p> };
  return {
    image: album.images?.[0]?.url || 'placeholder.jpg',
    title: album.name || 'Untitled',
    details: [
      <p key="artists"><strong>Artist(s):</strong> {album.artists?.map(a => a.name).join(', ')} produced with {album.label}</p>,
      <p key="release"><strong>Release Date:</strong> {album.release_date}</p>,
      <p key="genres"><strong>Genres:</strong> {album.genres?.join(', ') || 'N/A'}</p>,
      <p key="spotify"><strong>Spotify URL:</strong> <a href={album.external_urls?.spotify} target="_blank" rel="noopener noreferrer">View on Spotify</a></p>,
    ],
    summary: (
      <div>
        <h4>Track List:</h4>
        <ul>
          {(album.tracks?.items || []).map((track, i) => (
            <li key={track.id || i}>{i + 1}. {track.name} - {track.artists.map(a => a.name).join(', ')}</li>
          ))}
        </ul>
      </div>
    ),
  };
};

const AlbumDetail = () => (
  <DetailPage fetchDetails={fetchAlbumDetails} extractDetails={extractAlbumDetails} mediaType="album" tokenRequired={false} />
);
export default AlbumDetail;




