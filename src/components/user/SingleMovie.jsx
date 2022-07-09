import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSingleMovie } from '../../api/movie';
import { useAuth, useNotification } from '../../hooks';
import { convertReviewCount } from '../../utils/helper';
import Container from '../Container';
import CustomButtonLink from '../CustomButtonLink';
import AddRatingModal from '../modals/AddRatingModal';
import ProfileModal from '../modals/ProfileModal';
import RatingStar from '../RatingStar';
import RelatedMovie from '../RelatedMovie';

const convertDate = (date = '') => {
  return date.split('T')[0];
};

export default function SingleMovie() {
  const [movie, setMovie] = useState({});
  const [ready, setReady] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});

  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const { movieId } = useParams();
  const navigate = useNavigate();

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate('/auth/signin');
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
  };

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);
    if (error) return updateNotification('error', error);

    setMovie(movie);
    setReady(true);
  };

  useEffect(() => {
    if (movieId) fetchMovie();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
          Please wait...
        </p>
      </div>
    );

  const {
    trailer,
    poster,
    title,
    id,
    storyLine,
    language,
    releaseDate,
    director = {},
    reviews = {},
    writers = [],
    cast = [],
    genres = [],
    type,
  } = movie;

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="px-2 xl:px-0">
        <video poster={poster} src={trailer} controls></video>
        <div className="flex justify-between">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <CustomButtonLink
              label={`${convertReviewCount(reviews.reviewCount)} Reviews`}
              onClick={() => navigate(`/movie/reviews/${id}`)}
            />
            <CustomButtonLink
              label="Rate The Movie"
              onClick={handleOnRateMovie}
            />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>

          <ListWithLabel label="Director:">
            <CustomButtonLink
              label={director.name}
              onClick={() => handleProfileClick(director)}
            />
          </ListWithLabel>

          <ListWithLabel label=" Writers:">
            {writers.map((w) => (
              <CustomButtonLink key={w.id} label={w.name} />
            ))}
          </ListWithLabel>

          <ListWithLabel label="Cast:">
            {cast.map(({ id, profile, leadActor }) =>
              leadActor ? (
                <CustomButtonLink key={id} label={profile.name} />
              ) : null
            )}
          </ListWithLabel>

          <ListWithLabel label="Language:">
            <CustomButtonLink label={language} clickable="false" />
          </ListWithLabel>

          <ListWithLabel label="Release Date:">
            <CustomButtonLink
              label={convertDate(releaseDate)}
              clickable={false}
            />
          </ListWithLabel>

          <ListWithLabel label="Genres:">
            {genres.map((g) => (
              <CustomButtonLink key={g} label={g} clickable={false} />
            ))}
          </ListWithLabel>

          <ListWithLabel label="Type:">
            <CustomButtonLink label={type} clickable={false} />
          </ListWithLabel>

          <CastProfiles cast={cast} />

          <RelatedMovie movieId={movieId} />
        </div>
      </Container>

      <AddRatingModal
        onSuccess={handleOnRatingSuccess}
        visible={showRatingModal}
        onClose={hideRatingModal}
      />
      <ProfileModal
        profileId={selectedProfile.id}
        visible={showProfileModal}
        onClose={hideProfileModal}
      />
    </div>
  );
}

const ListWithLabel = ({ label, children }) => {
  return (
    <div className="flex flex-wrap gap-x-2">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">
        {label}
      </p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast }) => {
  return (
    <div>
      <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
        Cast:
      </h1>
      <div className="flex flex-wrap gap-4">
        {cast.map(({ profile, roleAs }) => {
          return (
            <div
              key={profile.id}
              className="flex flex-col items-center text-center basis-28"
            >
              <img
                className="w-24 h-24 rounded-full aspect-square object-cover"
                src={profile.avatar}
                alt=""
              />

              <CustomButtonLink label={profile.name} />
              <span className="text-light-subtle dark:text-dark-subtle text-sm">
                as
              </span>
              <p className="text-light-subtle dark:text-dark-subtle">
                {roleAs}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
