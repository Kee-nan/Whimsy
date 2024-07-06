import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard'; // Import the new component

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [review, setReview] = useState(null); // State for storing review

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/api/books/${id}`);
        setBook(response.data);
        
        // Retrieve the review data from local storage
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const reviewData = reviews[`books/${id}`];
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleAddToList = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const bookItem = {
      url: `books/${id}`,
      title: book.volumeInfo.title,
      image: book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg',
    };
    localStorage.setItem(listName, JSON.stringify([...list, bookItem]));
  };

  const addToCompleted = () => handleAddToList('completedList');
  const addToFutures = () => handleAddToList('futuresList');

  const handleDelete = () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`books/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null); // Update the state to reflect the deletion
  };

  const handleEdit = () => {
    navigate('/leaveReview', {
      state: {
        mediaDetails: {
          url: `books/${id}`,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg',
          review,
        },
      },
    });
  };

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText;
  };

  if (!book) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'}
        title={book.volumeInfo.title}
        details={
          <>
            <p><strong>Author:</strong> {book.volumeInfo.authors?.join(', ')}</p>
            <p><strong>Published Date:</strong> {book.volumeInfo.publishedDate}</p>
            <p><strong>Description:</strong> {stripHtmlTags(book.volumeInfo.description)}</p>
            <p><strong>Categories:</strong> {book.volumeInfo.categories?.join(', ')}</p>
          </>
        }
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
      />
      {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
    </>
  );
};

export default BookDetail;

// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard';
// import useMediaDetail from '../../hooks/useMediaDetail';

// const transformBookData = (data) => data; // Adjust according to Google Books API response structure

// const BookDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { media: book, review, addToCompleted, addToFutures, handleReview, handleDelete } = useMediaDetail(
//     id,
//     `https://www.googleapis.com/books/v1/volumes/${id}`,
//     'book',
//     transformBookData
//   );

//   if (!book) return <p>Loading...</p>;

//   const handleEdit = () => {
//     navigate('/leaveReview', {
//       state: {
//         mediaDetails: {
//           url: `books/${id}`,
//           title: book.volumeInfo?.title,
//           image: book.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg',
//           review,
//         },
//       },
//     });
//   };

//   return (
//     <>
//       <AppNavbar />
//       <DetailCard
//         image={book.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg'}
//         title={book.volumeInfo?.title}
//         details={
//           <>
//             <p><strong>Author:</strong> {book.volumeInfo?.authors?.join(', ') || 'N/A'}</p>
//             <p><strong>Published Date:</strong> {book.volumeInfo?.publishedDate || 'N/A'}</p>
//             <p><strong>Description:</strong> {book.volumeInfo?.description || 'N/A'}</p>
//             <p><strong>Categories:</strong> {book.volumeInfo?.categories?.join(', ') || 'N/A'}</p>
//           </>
//         }
//         onAddToCompleted={addToCompleted}
//         onAddToFutures={addToFutures}
//       />
//       {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
//     </>
//   );
// };

// export default BookDetail;








