import React, { useState } from 'react';
import { commonInputClasses } from '../../utils/theme';
import TagsInput from './TagsInput';
import Submit from '../form/Submit';
import { useNotification } from '../../hooks';
import WritersModal from '../modals/WritersModal';
import CastForm from '../form/CastForm';
import CastModal from '../modals/CastModal';
import PosterSelector from '../PosterSelector';
import GenresSelector from '../GenresSelector';
import GenresModal from '../modals/GenresModal';
import Selector from '../Selector';
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from '../../utils/options';
import Label from '../Label';
import DirectorSelector from '../DirectorSelector';
import WriterSelector from '../WriterSelector';
import ViewAllButton from '../ViewAllButton';
import LabelWithBadge from '../LabelWithBadge';

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
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState(null);
  const [writerName, setWriterName] = useState('');

  // console.log(movieInfo);

  const { updateNotification } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(movieInfo);
  };

  const {
    title,
    storyLine,

    writers,
    cast,
    tags,
    genres,
    type,
    language,
    status,
  } = movieInfo;

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === 'poster') {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

    if (name === 'writers') return setWriterName(value);

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

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
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
    setWriterName('');
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

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
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
            <TagsInput value={tags} onChange={updateTags} name="tags" />
          </div>

          <DirectorSelector onSelect={updateDirector} />

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
            <WriterSelector onSelect={updateWriters} />
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

          <div>
            <input
              type="date"
              className={`${commonInputClasses} border-2 rounded p-1 w-auto`}
              onChange={handleChange}
              name="releaseDate"
            />
          </div>

          <Submit value="Upload" onClick={handleSubmit} type="button" />
        </div>

        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            accept="image/*"
            label="Select poster"
          />
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />

          <Selector
            onChange={handleChange}
            name="type"
            options={typeOptions}
            value={type}
            label="Type"
          />
          <Selector
            onChange={handleChange}
            name="language"
            options={languageOptions}
            value={language}
            label="Language"
          />
          <Selector
            onChange={handleChange}
            name="status"
            options={statusOptions}
            value={status}
            label="Status"
          />
        </div>
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

      <GenresModal
        visible={showGenresModal}
        onClose={hideGenresModal}
        onSubmit={updateGenres}
        previousSelection={genres}
      />
    </>
  );
}
