import React, { createContext, useEffect, useState } from 'react';
import { getIsAuth, signinUser } from '../api/auth';

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: '',
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await signinUser({ email, password });
    if (error) {
      return setAuthInfo({ ...authInfo, error, isPending: false });
    }

    setAuthInfo({
      profile: { ...user },
      error: '',
      isPending: false,
      isLoggedIn: true,
    });

    localStorage.setItem('auth-token', user.token);
  };

  const isAuth = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return;

    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await getIsAuth(token);

    if (error) return setAuthInfo({ ...authInfo, isPending: false, error });

    setAuthInfo({
      profile: { ...user },
      error: '',
      isPending: false,
      isLoggedIn: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setAuthInfo({ ...defaultAuthInfo });
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authInfo, handleLogin, handleLogout, isAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
