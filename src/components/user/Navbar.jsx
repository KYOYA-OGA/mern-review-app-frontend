import React from 'react';
import { BsFillSunFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks';
import Container from '../Container';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  return (
    <header className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img src="./logo.png" alt="5star MRP" className="h-10" />
          </Link>
          <ul className="flex items-center space-x-4">
            <li>
              <button
                onClick={toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded"
              >
                <BsFillSunFill className="text-secondary" size={24} />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white"
                placeholder="Search..."
              />
            </li>
            <Link to="/auth/signin">
              <li className="text-white font-semibold text-lg">Login</li>
            </Link>
          </ul>
        </div>
      </Container>
    </header>
  );
}
