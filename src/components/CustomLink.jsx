import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomLink({ to, children }) {
  return (
    <Link
      className="dark:text-dark-subtle dark:hover:text-white text-light-subtle hover:text-primary transition-colors"
      to={to}
    >
      {children}
    </Link>
  );
}
