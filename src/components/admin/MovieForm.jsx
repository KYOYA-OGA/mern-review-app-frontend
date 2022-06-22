import React from 'react';
import { commonInputClasses } from '../../utils/theme';
import LiveSearch from '../LiveSearch';
import TagsInput from './TagsInput';
import { results } from '../../fakeData';

export default function MovieForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const renderItem = (result) => {
    return (
      <div key={result.id} className="flex space-x-2 rounded overflow-hidden">
        <img
          src={result.avatar}
          alt={result.name}
          className="w-16 h-16 object-cover"
        />
        <p className="dark:text-white font-semibold">{result.name}</p>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <div className="w-[70%] space-y-5">
        <div>
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            type="text"
            className={`${commonInputClasses} border-b-2 font-semibold text-xl`}
            placeholder="Titanic"
          />
        </div>

        <div>
          <Label htmlFor="storyLine">Story Line</Label>
          <textarea
            id="storyLine"
            className={`${commonInputClasses} border-b-2 resize-none h-24`}
            placeholder="Movie story line..."
          ></textarea>
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <TagsInput name="tags" />
        </div>

        <div>
          <LiveSearch
            placeholder="Search profile..."
            results={results}
            renderItem={renderItem}
            onSelect={(result) => console.log(result)}
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
      </div>
      <div className="w-[30%] h-5 bg-blue-400"></div>
    </form>
  );
}

const Label = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="dark:text-dark-subtle text-light-subtle font-semibold"
    >
      {children}
    </label>
  );
};
