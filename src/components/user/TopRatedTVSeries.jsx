import React, { useState, useEffect } from 'react';
import { getTopRateMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import MovieList from './MovieList';

export default function TopRatedTVSeries() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRateMovies('TV Series', signal);
    if (error) return updateNotification('error', error);

    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();

    fetchMovies(ac.signal);

    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MovieList movies={movies} title="Viewers choice (TV Series)" />;
}
