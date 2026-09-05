// src/components/Layout.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '@store/store';
import { Outlet, useLocation, Navigate } from '@tanstack/react-router';
import Display from './pages/layout/display';
import Footer from './pages/layout/footer';
import AuthPage from './pages/auth';
import { getAuthCookie } from '../shared/lib/cookies';

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getAuthCookie();
};

const Layout: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const location = useLocation();
  const authenticated = isAuthenticated();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // If on auth page and authenticated, redirect to home
  if (authenticated && location.pathname === '/auth') {
    return <Navigate to="/" />;
  }

  // If on auth page, render nothing (AuthPage handles it)
  if (location.pathname === '/auth') {
    return null;
  }

  // If not authenticated, show auth page
  if (!authenticated) {
    return <AuthPage />;
  }

  // Authenticated - show main app with header/footer
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary transition-colors duration-300">
      <div className="grow flex-1">
        <Display />
        <Outlet />
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;