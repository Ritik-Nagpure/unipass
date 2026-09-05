import React, { useEffect } from 'react';
import { useAppSelector } from '../../store/store';
import Display from '../pages/layout/display';
import Footer from '../pages/layout/footer';

const AppLayout: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary transition-colors duration-300">
      <div className="grow flex-1">
        <Display />
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;