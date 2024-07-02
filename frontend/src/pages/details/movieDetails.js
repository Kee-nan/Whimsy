import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import { Container, Card } from 'react-bootstrap';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <Card>
          <Card.Img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Text>{movie.overview}</Card.Text>
            <Card.Text>Release Date: {movie.release_date}</Card.Text>
            <Card.Text>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</Card.Text>
            <Card.Text>Runtime: {movie.runtime} minutes</Card.Text>
            <Card.Text>Average Vote: {movie.vote_average}</Card.Text>
            <Card.Text>Vote Count: {movie.vote_count}</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default MovieDetail;
