// // src/pages/searchs/showDetails.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard'; // Import the new component

// const ShowDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [show, setShow] = useState(null);
//   const [review, setReview] = useState(null); // State for storing review

//   useEffect(() => {
//     const fetchShowDetails = async () => {
//       try {
//         const response = await axios.get(`https://api.tvmaze.com/shows/${id}`);
//         setShow(response.data);
        
//         // Retrieve the review data from local storage
//         const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//         const reviewData = reviews[`shows/${id}`];
//         setReview(reviewData);
//       } catch (error) {
//         console.error("Error fetching show details:", error);
//       }
//     };

//     fetchShowDetails();
//   }, [id]);

//   const handleAddToList = (listName) => {
//     const list = JSON.parse(localStorage.getItem(listName)) || [];
//     const showItem = {
//       url: `shows/${id}`,
//       media: 'Show',
//       title: show.name,
//       image: show.image?.original || 'placeholder.jpg',
//     };
//     localStorage.setItem(listName, JSON.stringify([...list, showItem]));
//   };

//   const addToCompleted = () => handleAddToList('completedList');
//   const addToFutures = () => handleAddToList('futuresList');

//   const handleDelete = () => {
//     const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//     delete reviews[`shows/${id}`];
//     localStorage.setItem('reviews', JSON.stringify(reviews));
//     setReview(null); // Update the state to reflect the deletion
//   };

//   const handleEdit = () => {
//     navigate('/leaveReview', {
//       state: {
//         mediaDetails: {
//           url: `shows/${id}`,
//           media: 'Show',
//           title: show.name,
//           image: show.image?.original || 'placeholder.jpg',
//           review,
//         },
//       },
//     });
//   };

//   const handleBack = () => {
//     navigate('/shows', {
//       state: {
//         searchKey: location.state?.searchKey,
//         searchResults: location.state?.searchResults
//       }
//     });
//   };

//   const stripHtmlTags = (html) => {
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = html;
//     return tempDiv.innerText;
//   };

//   if (!show) return <p>Loading...</p>;

//   return (
//     <>
//       <AppNavbar />
//       <button onClick={handleBack}>Back</button>
//       <DetailCard
//         image={show.image?.original || 'placeholder.jpg'}
//         title={show.name}
//         details={
//           <>
//             <p><strong>Language:</strong> {show.language}</p>
//             <p><strong>Status:</strong> {show.status}</p>
//             <p><strong>Genres:</strong> {show.genres.join(', ')}</p>
//             <p><strong>Summary:</strong> {stripHtmlTags(show.summary)}</p>
//           </>
//         }
//         onAddToCompleted={addToCompleted}
//         onAddToFutures={addToFutures}
//       />
//       {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
//     </>
//   );
// };

// export default ShowDetail;


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











