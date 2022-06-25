import React, { useState, useEffect } from 'react';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { getActors } from '../../api/actor';
import { useNotification } from '../../hooks';
import NextPrevButton from '../NextPrevButton';

let currentPageNo = 0;
const limit = 10;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

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
    currentPageNo--;
    fetchActors(currentPageNo);
  };

  useEffect(() => {
    fetchActors(currentPageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-5">
      <ul className="grid grid-cols-4 gap-5">
        {actors.map((actor) => {
          return <ActorProfile key={actor.id} profile={actor} />;
        })}
      </ul>

      <NextPrevButton
        className="mt-5"
        onNextClick={handleOnNextClick}
        onPrevClick={handleOnPrevClick}
      />
    </div>
  );
}

const ActorProfile = ({ profile }) => {
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
          <p className="">{about.substring(0, 50)}</p>
        </div>

        <Options visible={showOptions} />
      </div>
    </li>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex items-center justify-center space-x-5">
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition-opacity"
        type="button"
      >
        <BsTrash />
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition-opacity"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
