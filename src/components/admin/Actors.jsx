import React, { useState } from 'react';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

export default function Actors() {
  return (
    <ul className="grid grid-cols-4 gap-3 my-5">
      <ActorProfile
        profile={{
          name: 'John Doe',
          about:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, optio?olor sit amet consectetur adipisicing elit. Cum, optio?',
          avatar:
            'https://images.unsplash.com/photo-1649859394657-8762d8a4758a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=400&q=60',
        }}
      />
    </ul>
  );
}

const ActorProfile = ({ profile }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };

  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  if (!profile) return null;

  const {
    name,
    about = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, optio?',
    avatar,
  } = profile;
  return (
    <li className="bg-white shadow dark:shadow dark:bg-secondary h-20 rounded overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img
          src={avatar}
          alt={name}
          className="w-20 aspect-square object-cover"
        />
        <div className="px-2 text-primary dark:text-white">
          <h1 className="text-xl font-semibold">{name}</h1>
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
