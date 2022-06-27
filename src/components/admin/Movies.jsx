import React, { useState } from 'react';
import { useEffect } from 'react';
import { getMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import MovieListItem from '../MovieListItem';
import NextPrevButton from '../NextPrevButton';

const limit = 4;
let currentPageNo = 0;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const { updateNotification } = useNotification();

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo++;
    fetchMovies(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo--;
    fetchMovies(currentPageNo);
  };

  const fetchMovies = async (pageNo) => {
    const { movies, error } = await getMovies(pageNo, limit);
    if (error) return updateNotification('error', error);

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMovies();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3 p-5">
      {movies.map((movie) => {
        return <MovieListItem key={movie.id} movie={movie} />;
      })}
      <NextPrevButton
        className="mt-5"
        onNextClick={handleOnNextClick}
        onPrevClick={handleOnPrevClick}
      />
    </div>
  );
}
