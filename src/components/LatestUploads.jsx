import React from 'react';
import { useEffect } from 'react';
import { useMovies } from '../hooks';
import MovieListItem from './MovieListItem';

export default function LatestUploads() {
  const { fetchLatestUploads, latestUploads } = useMovies();

  const handleUIUpdate = () => fetchLatestUploads();

  useEffect(() => {
    fetchLatestUploads();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="col-span-2 bg-white shadow dark:shadow dark:bg-secondary p-5 rounded">
        <h1 className="text-2xl mb-2 text-primary dark:text-white font-semibold">
          Recent Uploads
        </h1>
        <div className="mt-3 space-y-3">
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                key={movie.id}
                movie={movie}
                afterDelete={handleUIUpdate}
                afterUpdate={handleUIUpdate}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
