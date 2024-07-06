import { useState, useEffect } from 'react';
import axios from 'axios';

const useMediaDetail = (id, url, type, transformData, token = null) => {
  const [media, setMedia] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = token ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } : {}; // No headers if no token is provided

        const response = await axios.get(url, config);
        setMedia(transformData(response.data)); // Use the transformData function to process the data

        // Retrieve the review data from local storage
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const reviewData = reviews[`${type}/${id}`];
        setReview(reviewData);
      } catch (error) {
        console.error('Error fetching media details:', error);
      }
    };

    fetchData();
  }, [id, url, token, transformData, type]);

  const addToCompleted = () => {
    const completedList = JSON.parse(localStorage.getItem('completedList')) || [];
    if (!completedList.some(item => item.id === id && item.type === type)) {
      completedList.push({ id, type, title: media.title, image: media.images?.jpg?.image_url, url: `${type}/${id}` });
      localStorage.setItem('completedList', JSON.stringify(completedList));
    }
  };

  const addToFutures = () => {
    const futuresList = JSON.parse(localStorage.getItem('futuresList')) || [];
    if (!futuresList.some(item => item.id === id && item.type === type)) {
      futuresList.push({ id, type, title: media.title, image: media.images?.jpg?.image_url, url: `${type}/${id}` });
      localStorage.setItem('futuresList', JSON.stringify(futuresList));
    }
  };

  const handleReview = (newReview) => {
    setReview(newReview);
  };

  const handleDelete = (title) => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`${type}/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null); // Update the state to reflect the deletion
  };

  return {
    media,
    review,
    addToCompleted,
    addToFutures,
    handleReview,
    handleDelete,
  };
};

export default useMediaDetail;

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useMediaDetail = (id, url, type, transformData, token = null) => {
//   const [media, setMedia] = useState(null);
//   const [review, setReview] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const config = token ? {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         } : {}; // No headers if no token is provided

//         const response = await axios.get(url, config);
//         console.log('API response:', response.data); // Log the full response for debugging
//         setMedia(transformData(response.data)); // Use the transformData function to process the data
//       } catch (error) {
//         console.error('Error fetching media details:', error);
//       }
//     };

//     fetchData();
//   }, [id, url, token, transformData]);

//   const addToCompleted = () => {
//     const completedList = JSON.parse(localStorage.getItem('completedList')) || [];
//     if (!completedList.some(item => item.id === id && item.type === type)) {
//       completedList.push({ id, type, title: media.title, image: media.images?.jpg?.image_url, url: `anime/${id}` });
//       localStorage.setItem('completedList', JSON.stringify(completedList));
//     }
//   };

//   const addToFutures = () => {
//     const futuresList = JSON.parse(localStorage.getItem('futuresList')) || [];
//     if (!futuresList.some(item => item.id === id && item.type === type)) {
//       futuresList.push({ id, type, title: media.title, image: media.images?.jpg?.image_url, url: `anime/${id}` });
//       localStorage.setItem('futuresList', JSON.stringify(futuresList));
//     }
//   };

//   const handleReview = (newReview) => {
//     setReview(newReview);
//   };

//   const handleDelete = () => {
//     setReview(null);
//   };

//   return {
//     media,
//     review,
//     addToCompleted,
//     addToFutures,
//     handleReview,
//     handleDelete,
//   };
// };

// export default useMediaDetail;

