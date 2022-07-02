import React, { createContext, useState } from 'react';
import { getMovies } from '../api/movie';
import { useNotification } from '../hooks';

const limit = 4;
let currentPageNo = 0;

export const MoviesContext = createContext();

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const { updateNotification } = useNotification();

  const fetchMovies = async (pageNo = currentPageNo) => {
    const { movies, error } = await getMovies(pageNo, limit);
    if (error) return updateNotification('error', error);

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  const fetchNextPage = () => {
    if (reachedToEnd) return;
    currentPageNo++;
    fetchMovies(currentPageNo);
  };

  const fetchPrevPage = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo--;
    fetchMovies(currentPageNo);
  };

  const fetchLatestUploads = async (qty = 4) => {
    const { error, movies } = await getMovies(0, qty);
    if (error) return updateNotification('error', error);

    setLatestUploads([...movies]);
  };

  return (
    <MoviesContext.Provider
      value={{
        movies,
        latestUploads,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
        fetchLatestUploads,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesProvider;
