// src/components/ThemeInitializer.tsx
import { useEffect } from 'react';
import { useAppSelector } from '@store/store';

export const ThemeInitializer: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return null; // This component doesn't render anything
};