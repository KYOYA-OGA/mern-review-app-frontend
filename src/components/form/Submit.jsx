import React from 'react';

export default function Submit({ value }) {
  return (
    <input
      type="submit"
      className="w-full rounded dark:bg-white bg-secondary hover:bg-opacity-90 transition-opacity font-semibold text-lg text-white dark:text-secondary cursor-pointer p-1"
      value={value}
    />
  );
}
