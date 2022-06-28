import React, { useState } from 'react';
import { useEffect } from 'react';
import { deleteMovie, getMovieForUpdate, getMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import ConfirmModal from '../modals/ConfirmModal';
import UpdateMovie from '../modals/UpdateMovie';
import MovieListItem from '../MovieListItem';
import NextPrevButton from '../NextPrevButton';

const limit = 4;
let currentPageNo = 0;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);

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
    fetchMovies(currentPageNo);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleOnUpdate = (movie) => {
    const updatedMovies = movies.map((m) => {
      if (m.id === movie.id) return movie;
      return m;
    });

    setMovies([...updatedMovies]);
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
    <>
      <div className="space-y-3 p-5">
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
        <NextPrevButton
          className="mt-5"
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>
      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        title="Are you sure?"
        subtitle="This action will remove this movie permanently"
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
