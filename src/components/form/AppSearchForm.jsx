import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const defaultInputStyle = `dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white text-lg`;

export default function AppSearchForm({
  placeholder,
  onSubmit,
  showResetButton,
  onReset,
  inputClassName = defaultInputStyle,
}) {
  const [value, setValue] = useState('');

  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleReset = () => {
    setValue('');
    onReset();
  };

  return (
    <form onSubmit={handleOnSubmit} className="relative">
      <input
        type="text"
        className={`border-2 transition-colors bg-transparent rounded p-1 outline-none ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {showResetButton ? (
        <button
          onClick={handleReset}
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-2 dark:text-white text-secondary"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
}
