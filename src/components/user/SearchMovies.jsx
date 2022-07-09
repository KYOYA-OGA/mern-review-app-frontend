import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchPublicMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import Container from '../Container';
import NotFoundText from '../NotFoundText';
import MovieList from './MovieList';

export default function SearchMovies() {
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('title');

  const { updateNotification } = useNotification();

  const handleAfterDelete = (movie) => {
    const updatedMovies = movies.map((m) => {
      if (m.id === movie.id) return movie;
      return m;
    });
    setMovies([...updatedMovies]);
  };

  const handleAfterUpdate = (movie) => {
    const updatedMovies = movies.filter((m) => m.id !== movie.id);
    setMovies([...updatedMovies]);
  };

  const searchMovies = async (val) => {
    const { error, results } = await searchPublicMovies(val);
    if (error) return updateNotification('error', error);

    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }

    setResultNotFound(false);
    setMovies([...results]);
  };

  useEffect(() => {
    if (query.trim()) searchMovies(query);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen py-8">
      <Container className="px-2 xl:px-0">
        <NotFoundText text="Record not found" visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}
