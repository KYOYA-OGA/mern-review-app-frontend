import React from 'react';
import { BsBoxArrowRight, BsPencilSquare, BsTrash } from 'react-icons/bs';

export default function MovieListItem({
  movie,
  onDeleteClick,
  onEditClick,
  onOpenClick,
}) {
  const { poster, title, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img className="w-full aspect-square" src={poster} alt={title} />
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
}
