import React from 'react';

export default function GridContainer({ children, className }) {
  return (
    <div
      className={`grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 ${className}`}
    >
      {children}
    </div>
  );
}
