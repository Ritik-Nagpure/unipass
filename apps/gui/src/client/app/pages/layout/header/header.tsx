// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAppSelector, useAppDispatch } from '../store/store';
import { toggleTheme } from '../store/themeSlice';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../assets/Logo.png';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-primary/95 backdrop-blur-md shadow-lg'
          : 'bg-bg-primary'
      }`}
      role="banner"
      aria-label="Header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-text-primary hover:text-primary transition-colors duration-200"
            aria-label="Homepage"
          >
            <img 
              src={logo} 
              alt="Unipass Logo" 
              className="w-8 h-8 md:w-9 md:h-9 object-contain"
            />
            <span>Unipass</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <FaMoon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <FaSun className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;