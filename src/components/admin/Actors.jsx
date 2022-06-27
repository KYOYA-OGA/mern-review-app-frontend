import React, { useState, useEffect } from 'react';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { getActors } from '../../api/actor';
import { useNotification } from '../../hooks';
import UpdateActor from '../modals/UpdateActor';
import NextPrevButton from '../NextPrevButton';

let currentPageNo = 0;
const limit = 10;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const { updateNotification } = useNotification();

  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return updateNotification('error', error);

    if (!profiles.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setActors(profiles);
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo++;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo--;
    fetchActors(currentPageNo);
  };

  const handleOnEditClick = (profile) => {
    setShowUpdateModal(true);
    setSelectedProfile(profile);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOnActorUpdate = (profile) => {
    const updatedActors = actors.map((actor) => {
      if (actor.id === profile.id) {
        return profile;
      }

      return actor;
    });

    setActors([...updatedActors]);
  };

  useEffect(() => {
    fetchActors(currentPageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="p-5">
        <ul className="grid grid-cols-4 gap-5">
          {actors.map((actor) => {
            return (
              <ActorProfile
                key={actor.id}
                profile={actor}
                onEditClick={() => handleOnEditClick(actor)}
              />
            );
          })}
        </ul>

        <NextPrevButton
          className="mt-5"
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>
      <UpdateActor
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnActorUpdate}
      />
    </>
  );
}

const ActorProfile = ({ profile, onEditClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };

  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  const getName = (name) => {
    if (name.length <= acceptedNameLength) return name;

    return name.substring(0, acceptedNameLength) + '...';
  };

  if (!profile) return null;

  const { name, about = '', avatar } = profile;
  return (
    <li className="bg-white shadow dark:shadow dark:bg-secondary h-24 rounded overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img
          src={avatar}
          alt={name}
          className="w-24 aspect-square object-cover"
        />
        <div className="px-2 text-primary dark:text-white">
          <h1 className="text-xl font-semibold whitespace-nowrap ">
            {getName(name)}
          </h1>
          <p className="mt-2 text-sm opacity-75">{about.substring(0, 45)}</p>
        </div>

        <Options onEditClick={onEditClick} visible={showOptions} />
      </div>
    </li>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex items-center justify-center space-x-5">
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-blue-500 text-white hover:opacity-80 transition-opacity"
        type="button"
      >
        <BsPencilSquare />
      </button>
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-red-500 text-white hover:opacity-80 transition-opacity"
        type="button"
      >
        <BsTrash />
      </button>
    </div>
  );
};
