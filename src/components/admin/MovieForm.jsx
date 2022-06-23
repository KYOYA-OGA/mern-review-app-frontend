import React, { useState } from 'react';
import { commonInputClasses } from '../../utils/theme';
import LiveSearch from '../LiveSearch';
import TagsInput from './TagsInput';
import { results } from '../../fakeData';
import Submit from '../form/Submit';
import { useNotification } from '../../hooks';
import WritersModal from '../Modal/WritersModal';
import CastForm from '../form/CastForm';
import CastModal from '../Modal/CastModal';

export const renderItem = (result) => {
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

const defaultMovieInfo = {
  title: '',
  storyLine: '',
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releaseDate: '',
  poster: null,
  genres: [],
  type: '',
  language: '',
  status: '',
};

export default function MovieForm() {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);

  console.log(movieInfo);

  const { updateNotification } = useNotification();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(movieInfo);
  };

  const { title, storyLine, director, writers, cast } = movieInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;

    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          'warning',
          'This profile is already selected'
        );
      }
    }

    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter((writer) => writer.id !== profileId);

    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: newWriters });
  };

  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);

    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  return (
    <>
      <div className="flex space-x-3">
        <div className="w-[70%] space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              type="text"
              className={`${commonInputClasses} border-b-2 font-semibold text-xl`}
              placeholder="Titanic"
              value={title}
              onChange={handleChange}
              name="title"
            />
          </div>

          <div>
            <Label htmlFor="storyLine">Story Line</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              className={`${commonInputClasses} border-b-2 resize-none h-24`}
              placeholder="Movie story line..."
            ></textarea>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput onChange={updateTags} name="tags" />
          </div>

          <div>
            <Label htmlFor="director">Director</Label>
            <LiveSearch
              name="director"
              placeholder="Search profile..."
              results={results}
              renderItem={renderItem}
              onSelect={updateDirector}
              onChange={(e) => console.log(e.target.value)}
              value={director.name}
            />
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor={writers}>
                Writers
              </LabelWithBadge>
              <ViewAllButton
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllButton>
            </div>
            <LiveSearch
              name="writers"
              placeholder="Search Writers..."
              results={results}
              renderItem={renderItem}
              onSelect={updateWriters}
              onChange={(e) => console.log(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast &amp; Crew
              </LabelWithBadge>
              <ViewAllButton onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllButton>
            </div>

            <CastForm onSubmit={updateCast} />
          </div>

          <Submit value="Upload" onClick={handleSubmit} type="button" />
        </div>
        <div className="w-[30%] h-5 bg-blue-400"></div>
      </div>

      <WritersModal
        visible={showWritersModal}
        profiles={writers}
        onClose={hideWritersModal}
        onRemoveClick={handleWriterRemove}
      />

      <CastModal
        onClose={hideCastModal}
        visible={showCastModal}
        casts={cast}
        onRemoveClick={handleCastRemove}
      />
    </>
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
const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
  const renderBadge = () => {
    if (!badge) return null;
    return (
      <span className="dark:bg-dark-subtle bg-light-subtle text-white absolute top-0 right-0 translate-x-6 -translate-y-1 text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {badge <= 9 ? badge : '9+'}
      </span>
    );
  };
  return (
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {renderBadge()}
    </div>
  );
};

const ViewAllButton = ({ children, onClick, visible }) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      className="dark:text-white text-primary hover:underline transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
