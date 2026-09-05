// src/pages/auth/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { toggleTheme } from '../../../store/themeSlice';
import { getAuthCookie } from '../../../shared/lib/cookies';
import Identify from './identify';
import Login from './login';
import Signup from './signup';

type AuthMode = 'identify' | 'login' | 'signup';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [mode, setMode] = useState<AuthMode>('identify');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check if already authenticated
  const isAuthenticated = () => {
    return !!getAuthCookie();
  };

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate({ to: '/' });
    }
  }, [navigate]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const renderContent = () => {
    switch (mode) {
      case 'identify':
        return <Identify onModeChange={setMode} />;
      case 'login':
        return <Login onModeChange={setMode} />;
      case 'signup':
        return <Signup onModeChange={setMode} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      {/* Auth Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <a href="/" className="flex items-center gap-2 text-xl font-bold text-text-primary hover:text-primary transition-colors duration-200">
              <span className="text-2xl" role="img" aria-label="Lock icon">🔐</span>
              <span>Uni<span className="text-primary">Pass</span></span>
            </a>
            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <span className="text-xl" role="img" aria-label="Moon icon">🌙</span>
              ) : (
                <span className="text-xl" role="img" aria-label="Sun icon">☀️</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Auth Content */}
      <div className="pt-14 md:pt-16 min-h-screen flex items-center justify-center bg-bg-primary">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthPage;