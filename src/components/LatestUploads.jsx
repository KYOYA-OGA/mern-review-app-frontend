import React from 'react';
import { BsTrash, BsPencilSquare, BsBoxArrowRight } from 'react-icons/bs';

export default function LatestUploads() {
  return (
    <div className="col-span-2 bg-white shadow dark:shadow dark:bg-secondary p-5 rounded">
      <h1 className="text-2xl mb-2 text-primary dark:text-white font-semibold">
        Recent Uploads
      </h1>
      <MovieListItem
        movie={{
          poster:
            'https://images.unsplash.com/photo-1649859394657-8762d8a4758a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
          title: 'Super rich man',
          genres: ['Anime', 'Sci-Fi', 'Action'],
          status: 'public',
        }}
      />
    </div>
  );
}

const MovieListItem = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
  const { poster, title, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img className="w-full aspect-video" src={poster} alt={title} />
            </div>
          </td>
          <td className="w-full pl-5">
            <div>
              <h1 className="text-lg text-primary dark:text-white font-semibold">
                {title}
              </h1>
              <div className="space-x-1">
                {genres.map((genre, index) => {
                  return (
                    <span
                      key={genre + index}
                      className="text-xs text-primary dark:text-white"
                    >
                      {genre}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>

          <td className="px-5">
            <p className="text-primary dark:text-white">{status}</p>
          </td>

          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button onClick={onDeleteClick} type="button" className="">
                <BsTrash />
              </button>
              <button onClick={onEditClick} type="button" className="">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick} type="button" className="">
                <BsBoxArrowRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
