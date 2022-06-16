import React, { createContext, useState } from 'react';
import { signinUser } from '../api/auth';

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

  //todo: handleLogout, isAuth
  return (
    <AuthContext.Provider value={{ authInfo, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
