import React from 'react';

export default function Selector({ name, options, value, onChange, label }) {
  return (
    <div>
      <select
        className="border-2 bg-white dark:bg-primary dark:border-dark-subtle border-light-subtle p-1 pr-10 dark:focus:border-white focus:border-primary outline-none transition rounded bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">{label}</option>
        {options.map((option) => {
          const { value, title } = option;
          return (
            <option key={title} value={value}>
              {title}
            </option>
          );
        })}
      </select>
    </div>
  );
}
