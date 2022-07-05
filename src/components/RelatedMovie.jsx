import React, { useState } from 'react';
import { useEffect } from 'react';
import { getRelatedMovies } from '../api/movie';
import { useNotification } from '../hooks';
import MovieList from './user/MovieList';

export default function RelatedMovie({ movieId }) {
  const [movies, setMovies] = useState([]);

  const { updateNotification } = useNotification();

  const fetchRelatedMovies = async () => {
    const { error, movies } = await getRelatedMovies(movieId);
    if (error) return updateNotification('error', error);

    setMovies([...movies]);
  };

  useEffect(() => {
    if (movieId) fetchRelatedMovies();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  return <MovieList title="Related Movies" movies={movies} />;
}
