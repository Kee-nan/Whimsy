import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchPage from './templates/SearchPage';
import { MEDIA_TYPES, getMediaTypeConfig } from '../utils/mediaTypeConfig';

const SearchHub = () => {
  const { mediaType = 'movie' } = useParams();
  const navigate = useNavigate();
  const config = getMediaTypeConfig(mediaType);

  const tabButtons = (
    <>
      {MEDIA_TYPES.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`whimsy-btn whimsy-btn-tab ${t.key === mediaType ? 'active' : ''}`}
          onClick={() => navigate(`/search/${t.key}`)}
        >
          {t.label}
        </button>
      ))}
    </>
  );

  return (
    <SearchPage
      key={mediaType}
      searchFunction={config.searchFunction}
      renderCard={config.renderCard}
      placeholder={config.placeholder}
      extractId={config.extractId}
      mediaTypeSelector={tabButtons}
    />
  );
};

export default SearchHub;