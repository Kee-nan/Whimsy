import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard'; // Import the new component

const MangaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [manga, setManga] = useState(null);
  const [review, setReview] = useState(null); // State for storing review

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`);
        setManga(response.data.data);
        
        // Retrieve the review data from local storage
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const reviewData = reviews[`manga/${id}`];
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching manga details:", error);
      }
    };

    fetchMangaDetails();
  }, [id]);

  const handleAddToList = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const mangaItem = {
      url: `manga/${id}`,
      media: 'Manga',
      title: manga.title,
      image: manga.images.jpg.image_url,
    };
    localStorage.setItem(listName, JSON.stringify([...list, mangaItem]));
  };

  const addToCompleted = () => handleAddToList('completedList');
  const addToFutures = () => handleAddToList('futuresList');

  const handleDelete = () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`manga/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null); // Update the state to reflect the deletion
  };

  const handleEdit = () => {
    navigate('/leaveReview', {
      state: {
        mediaDetails: {
          url: `manga/${id}`,
          title: manga.title,
          image: manga.images.jpg.image_url,
          review,
        },
      },
    });
  };

  const handleBack = () => {
    navigate('/manga', {
      state: {
        searchKey: location.state?.searchKey,
        searchResults: location.state?.searchResults
      }
    });
  };

  if (!manga) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <button onClick={handleBack}>Back</button>
      <DetailCard
        image={manga.images.jpg.image_url}
        title={manga.title}
        details={
          <>
            <p><strong>Author:</strong> {manga.authors[0].name}</p>
            <p><strong>Background:</strong> {manga.background}</p>
            <p><strong>Demographic:</strong> {manga.demographics[0].name}</p>
            <p><strong>Status:</strong> {manga.status}</p>
            <p><strong>Genres:</strong> {manga.genres?.map(genre => genre.name).join(', ')}</p>
            <p><strong>Plot:</strong> {manga.synopsis}</p>
          </>
        }
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
      />
      {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
    </>
  );
};

export default MangaDetail;





// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard';
// import useMediaDetail from '../../hooks/useMediaDetail';

// const transformMangaData = (data) => data.data; // Adjust according to Jikan API response structure

// const MangaDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { media: manga, review, addToCompleted, addToFutures, handleReview, handleDelete } = useMediaDetail(
//     id,
//     `https://api.jikan.moe/v4/manga/${id}/full`,
//     'manga',
//     transformMangaData
//   );

//   if (!manga) return <p>Loading...</p>;

//   const handleEdit = () => {
//     navigate('/leaveReview', {
//       state: {
//         mediaDetails: {
//           url: `manga/${id}`,
//           title: manga.title,
//           image: manga.images?.jpg?.image_url || 'placeholder.jpg',
//           review,
//         },
//       },
//     });
//   };

//   return (
//     <>
//       <AppNavbar />
//       <DetailCard
//         image={manga.images?.jpg?.image_url || 'placeholder.jpg'}
//         title={manga.title}
//         details={
//           <>
//             <p><strong>Author:</strong> {manga.authors?.[0]?.name || 'N/A'}</p>
//             <p><strong>Background:</strong> {manga.background || 'N/A'}</p>
//             <p><strong>Demographic:</strong> {manga.demographics?.[0]?.name || 'N/A'}</p>
//             <p><strong>Status:</strong> {manga.status || 'N/A'}</p>
//             <p><strong>Genres:</strong> {manga.genres?.map(genre => genre.name).join(', ') || 'N/A'}</p>
//             <p><strong>Plot:</strong> {manga.synopsis || 'N/A'}</p>
//           </>
//         }
//         onAddToCompleted={addToCompleted}
//         onAddToFutures={addToFutures}
//       />
//       {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
//     </>
//   );
// };

// export default MangaDetail;