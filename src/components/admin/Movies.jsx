import { useEffect } from 'react';
import { useMovies } from '../../hooks';
import MovieListItem from '../MovieListItem';
import NextPrevButton from '../NextPrevButton';

export default function Movies() {
  const {
    fetchMovies,
    movies: newMovies,
    fetchNextPage,
    fetchPrevPage,
  } = useMovies();

  const handleUIUpdate = () => fetchMovies();

  useEffect(() => {
    fetchMovies();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="space-y-3 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          );
        })}
        <NextPrevButton
          className="mt-5"
          onNextClick={fetchNextPage}
          onPrevClick={fetchPrevPage}
        />
      </div>
    </>
  );
}
