import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/detailpage.css';

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const intervals = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

/**
 * Global reviews list for a media item — 2-column grid, paginated
 * 10-at-a-time, sorted by like count descending. Each card shows the
 * reviewer's avatar/name, date, rating, review text, and a like button.
 */
const ReviewsListCard = ({ mediaType, externalId, currentUsername }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async (pageToFetch) => {
    setLoading(true);
    const token = localStorage.getItem('user_token');
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/review/list?mediaType=${mediaType}&id=${externalId}&page=${pageToFetch}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    }
    setLoading(false);
  }, [mediaType, externalId]);

  useEffect(() => { fetchReviews(page); }, [page, fetchReviews]);

  const handleLike = async (reviewId) => {
    const token = localStorage.getItem('user_token');
    // Optimistic update so the heart responds instantly.
    setReviews((prev) => prev.map((r) => r.id === reviewId
      ? { ...r, likedByMe: !r.likedByMe, likeCount: r.likeCount + (r.likedByMe ? -1 : 1) }
      : r
    ));
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/review/${reviewId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      // Revert on failure rather than leaving the UI out of sync.
      fetchReviews(page);
    }
  };

  return (
    <div className="reviews-list-card">
      <div className="reviews-list-header">
        <h4>Reviews {totalCount > 0 && `(${totalCount})`}</h4>
      </div>

      {loading ? (
        <p className="reviews-list-empty">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="reviews-list-empty">No reviews yet. Be the first to leave one!</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-tile">
              <div className="review-tile-header">
                <img
                  src={review.profilePicture ? `${process.env.REACT_APP_API_URL}${review.profilePicture}` : 'https://via.placeholder.com/40'}
                  alt={review.username}
                  className="review-tile-avatar"
                />
                <div className="review-tile-meta">
                  <span className="review-tile-username">
                    {review.username}
                    {review.username === currentUsername && <span className="review-tile-you-badge">You</span>}
                  </span>
                  <span className="review-tile-date">{timeAgo(review.createdAt)}</span>
                </div>
                <span className="review-tile-rating">{review.rating}/30</span>
              </div>

              <p className="review-tile-text">{review.reviewText || <em>No written review.</em>}</p>

              <button
                className={`review-tile-like ${review.likedByMe ? 'liked' : ''}`}
                onClick={() => handleLike(review.id)}
              >
                {review.likedByMe ? '❤️' : '🤍'} {review.likeCount}
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="reviews-pagination">
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="btn btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsListCard;