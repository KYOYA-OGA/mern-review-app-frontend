import React, { useEffect, useState } from 'react';
import genres from '../../utils/genres';
import Submit from '../form/Submit';
import ModalContainer from './ModalContainer';

export default function GenresModal({
  visible,
  previousSelection,
  onClose,
  onSubmit,
}) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenresSelector = (gen) => {
    let newGenres = [];

    if (selectedGenres.includes(gen)) {
      newGenres = selectedGenres.filter((g) => g !== gen);
    } else {
      newGenres = [...selectedGenres, gen];
    }

    setSelectedGenres([...newGenres]);
  };

  const handleSubmit = () => {
    onSubmit(selectedGenres);
    onClose();
  };

  const handleClose = () => {
    setSelectedGenres(previousSelection);
    onClose();
  };

  useEffect(() => {
    setSelectedGenres(previousSelection);
  }, [previousSelection]);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full">
        <div className="mb-10">
          <h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
            Select Genres
          </h1>

          <div className="mt-3 flex flex-wrap gap-3">
            {genres.map((item) => {
              return (
                <Genre
                  onClick={() => handleGenresSelector(item)}
                  selected={selectedGenres.includes(item)}
                  key={item}
                >
                  {item}
                </Genre>
              );
            })}
          </div>
        </div>
        <div className="w-full max-w-[240px] self-end">
          <Submit value="Select" type="button" onClick={handleSubmit} />
        </div>
      </div>
    </ModalContainer>
  );
}

const Genre = ({ children, selected, onClick }) => {
  const getSelectedStyle = () => {
    return selected
      ? 'dark:bg-white dark:text-primary bg-light-subtle text-white'
      : 'text-primary dark:text-white';
  };
  return (
    <button
      onClick={onClick}
      className={`${getSelectedStyle()} border-2 dark:border-dark-subtle border-light-subtle p-1 rounded whitespace-nowrap`}
    >
      {children}
    </button>
  );
};
