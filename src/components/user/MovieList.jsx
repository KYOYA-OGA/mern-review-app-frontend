import React from 'react';
import GridContainer from '../GridContainer';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const trimTitle = (text = '') => {
  if (text.length <= 20) return text;
  return text.substring(0.2) + '...';
};

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;

  return (
    <div>
      <h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
        {title}
      </h1>
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  const { id, title, poster, reviews } = movie;
  return (
    <Link to={`/movie/${id}`}>
      <img src={poster} alt={title} className="aspect-video object-cover" />
      <h2
        title={title}
        className="text-lg dark:text-white text-secondary font-semibold"
      >
        {trimTitle(title)}
      </h2>
      {reviews.ratingAvg ? (
        <p className="flex items-center space-x-1 text-highlight dark:text-highlight-dark">
          <span>{reviews?.ratingAvg}</span>
          <AiFillStar />
        </p>
      ) : (
        <p className="text-highlight dark:text-highlight-dark">No reviews</p>
      )}
    </Link>
  );
};
