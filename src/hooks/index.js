import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationProvider';
import { ThemeContext } from '../context/ThemeProvider';

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
