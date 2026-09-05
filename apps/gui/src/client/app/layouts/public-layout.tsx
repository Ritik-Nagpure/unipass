import React, { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { useAppSelector } from '../../store/store';
import Header from '../pages/layout/header';
import Footer from '../pages/layout/footer';

const PublicLayout: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary transition-colors duration-300">
      <Header />
      <div className="grow flex-1 pt-14 md:pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;