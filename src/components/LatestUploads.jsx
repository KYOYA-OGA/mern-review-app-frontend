import React, { useState } from 'react';
import { useEffect } from 'react';
import { deleteMovie, getMovieForUpdate, getMovies } from '../api/movie';
import { useNotification } from '../hooks';
import ConfirmModal from './modals/ConfirmModal';
import UpdateMovie from './modals/UpdateMovie';
import MovieListItem from './MovieListItem';

const pageNo = 0;
const limit = 4;

export default function LatestUploads() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const handleOnEditClick = async ({ id }) => {
    const { movie, error } = await getMovieForUpdate(id);

    if (error) return updateNotification('error', error);

    setSelectedMovie(movie);
    setShowUpdateModal(true);
  };

  const handleOnDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(selectedMovie.id);
    setBusy(false);

    if (error) return updateNotification('error', error);

    updateNotification('success', message);
    hideConfirmModal();
    fetchLatestUploads();
  };

  const handleOnUpdate = (movie) => {
    const updatedMovies = movies.map((m) => {
      if (m.id === movie.id) return movie;

      return m;
    });

    setMovies([...updatedMovies]);
  };

  const hideConfirmModal = () => setShowConfirmModal(false);
  const hideUpdateModal = () => setShowUpdateModal(false);

  const fetchLatestUploads = async () => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification('error', error);

    setMovies([...movies]);
  };

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
          {movies.map((movie) => {
            return (
              <MovieListItem
                key={movie.id}
                movie={movie}
                onEditClick={() => handleOnEditClick(movie)}
                onDeleteClick={() => handleOnDeleteClick(movie)}
              />
            );
          })}
        </div>
      </div>
      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        subtitle="This action will remove this movie permanently"
        onCancel={hideConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        busy={busy}
      />
      <UpdateMovie
        visible={showUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
        onClose={hideUpdateModal}
      />
    </>
  );
}
