import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BsTrash, BsPencilSquare } from 'react-icons/bs';
import { deleteReview, getReviewByMovie } from '../../api/review';
import { useAuth, useNotification } from '../../hooks';
import Container from '../Container';
import CustomButtonLink from '../CustomButtonLink';
import RatingStar from '../RatingStar';
import ConfirmModal from '../modals/ConfirmModal';
import NotFoundText from '../NotFoundText';
import EditRatingModal from '../modals/EditRatingModal';

const getNameInitial = (name = '') => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState({});
  const [movieTitle, setMovieTitle] = useState('');
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const { movieId } = useParams();
  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const { updateNotification } = useNotification();

  const findProfileOwnersReview = () => {
    if (profileOwnersReview) return setProfileOwnersReview(null);

    const matched = reviews.find((review) => review.owner.id === profileId);
    if (!matched)
      return updateNotification('error', "You don't have any review yet");

    setProfileOwnersReview(matched);
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };
  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const hideEditModal = () => {
    setShowEditModal(false);
    setSelectedReview({});
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnersReview.id);
    setBusy(false);
    if (error) return updateNotification('error', error);

    updateNotification('success', message);

    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );

    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);
    hideConfirmModal();
  };

  const handleOnEditClick = () => {
    const { id, content, rating } = profileOwnersReview;
    setSelectedReview({ id, content, rating });
    setShowEditModal(true);
  };

  const handleOnReviewUpdated = (review) => {
    const updatedReview = {
      ...profileOwnersReview,
      rating: review.rating,
      content: review.content,
    };
    setProfileOwnersReview({ ...updatedReview });

    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      return r;
    });
    setReviews([...newReviews]);
  };

  const fetchReviews = async () => {
    const { error, movie } = await getReviewByMovie(movieId);
    if (error) return updateNotification('error', error);

    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  useEffect(() => {
    if (movieId) fetchReviews();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="px-2 xl:px-0 py-8">
        <header className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold dark:text-white text-secondary">
            <span className="text-light-subtle dark:text-dark-subtle font-normal">
              Reviews for:
            </span>{' '}
            {movieTitle}
          </h1>
          {profileId ? (
            <CustomButtonLink
              label={profileOwnersReview ? 'View All' : 'Find My Review'}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </header>

        <NotFoundText text="No Reviews" visible={!reviews.length} />

        {profileOwnersReview ? (
          <div>
            <ReviewCard review={profileOwnersReview} />
            <div className="flex space-x-3 text-xl p-3">
              <button
                type="button"
                className="text-blue-500"
                onClick={handleOnEditClick}
              >
                <BsPencilSquare />
              </button>
              <button
                type="button"
                className="text-red-500"
                onClick={displayConfirmModal}
              >
                <BsTrash />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        onCancel={hideConfirmModal}
        onConfirm={handleDeleteConfirm}
        subtitle="This action will remove this review permanently"
        busy={busy}
      />
      <EditRatingModal
        initialState={selectedReview}
        visible={showEditModal}
        onSuccess={handleOnReviewUpdated}
        onClose={hideEditModal}
      />
    </div>
  );
}

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const { owner, content, rating } = review;
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white select-none">
        {getNameInitial(owner.name)}
      </div>

      <div className="">
        <h2 className="dark:text-white text-secondary font-semibold text-lg">
          {owner.name}
        </h2>
        <RatingStar rating={rating} />
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
