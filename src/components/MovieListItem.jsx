import React, { useState } from 'react';
import { BsBoxArrowRight, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { deleteMovie } from '../api/movie';
import { useNotification } from '../hooks';
import { getPoster } from '../utils/helper';
import ConfirmModal from './modals/ConfirmModal';
import UpdateMovie from './modals/UpdateMovie';

function MovieListItem({ movie, afterDelete, afterUpdate }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const handleEditClick = () => {
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
  };

  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);

    setBusy(false);
    if (error) return updateNotification('error', error);

    hideConfirmModal();
    updateNotification('success', message);
    afterDelete(movie);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);
  const hideUpdateModal = () => setShowUpdateModal(false);

  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleEditClick}
      />
      <div className="p-0">
        <ConfirmModal
          visible={showConfirmModal}
          onClose={hideConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          onCancel={hideConfirmModal}
          title="Are you sure?"
          subtitle="This action will remove this movie permanently"
          busy={busy}
        />
        <UpdateMovie
          onClose={hideUpdateModal}
          movieId={selectedMovieId}
          visible={showUpdateModal}
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
}

function MovieCard({ movie, onDeleteClick, onEditClick, onOpenClick }) {
  const { poster, responsivePosters, title, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img
                className="w-full aspect-square"
                src={getPoster(responsivePosters || poster)}
                alt={title}
              />
            </div>
          </td>
          <td className="w-full pl-5">
            <div>
              <h1 className="text-lg text-primary dark:text-white font-semibold">
                {title}
              </h1>
              <div className="space-x-1">
                {genres.map((genre, index) => {
                  return (
                    <span
                      key={genre + index}
                      className="text-xs text-primary dark:text-white"
                    >
                      {genre}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>

          <td className="px-5">
            <p className="text-primary dark:text-white">{status}</p>
          </td>

          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button
                onClick={onEditClick}
                type="button"
                className="text-blue-500"
              >
                <BsPencilSquare />
              </button>
              <button
                onClick={onOpenClick}
                type="button"
                className="text-green-500"
              >
                <BsBoxArrowRight />
              </button>
              <button
                onClick={onDeleteClick}
                type="button"
                className="text-red-500"
              >
                <BsTrash />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default MovieListItem;
