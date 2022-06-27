import React from 'react';
import MovieListItem from './MovieListItem';

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
