import React from 'react';

const commonPosterUIStyles =
  'flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer';

export default function PosterSelector({
  name,
  selectedPoster,
  onChange,
  accept,
}) {
  return (
    <div className="">
      <input
        accept={accept}
        name={name}
        onChange={onChange}
        id={name}
        type="file"
        hidden
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            src={selectedPoster}
            alt=""
            className={`${commonPosterUIStyles} object-cover`}
          />
        ) : (
          <PosterUI />
        )}
      </label>
    </div>
  );
}

const PosterUI = () => {
  return (
    <div className={commonPosterUIStyles}>
      <span className="dark:text-dark-subtle text-light-subtle">
        Select Poster
      </span>
    </div>
  );
};
