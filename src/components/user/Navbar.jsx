import React from 'react';
import { BsFillSunFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../../hooks';
import Container from '../Container';
import AppSearchForm from '../form/AppSearchForm';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate(`/movie/search?title=${query}`);
  };
  return (
    <header className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img src="./logo.png" alt="5star MRP" className="h-8 sm:h-10" />
          </Link>
          <ul className="flex items-center space-x-2 sm:space-x-4">
            <li>
              <button
                onClick={toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded text-lg sm:text-2xl"
              >
                <BsFillSunFill className="text-secondary" />
              </button>
            </li>
            <li>
              <AppSearchForm
                onSubmit={handleSearchSubmit}
                placeholder="Search"
                inputClassName="text-dark-subtle text-white focus:border-white w-40 sm:w-auto sm:text-lg"
              />
            </li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-white font-semibold text-lg"
              >
                Log out
              </button>
            ) : (
              <Link to="/auth/signin">
                <li className="text-white font-semibold text-lg">Login</li>
              </Link>
            )}
          </ul>
        </div>
      </Container>
    </header>
  );
}
