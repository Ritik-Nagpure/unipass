import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../shared/theme/ThemeProvider';
import { useAuth } from '../features/auth/hooks/useAuth';
import Button from '../shared/components/Button';
import Logo from '../../public/favicon.png';

const MainLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`
        sticky top-0 z-50 backdrop-blur-md border-b
        ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="rounded-lg flex items-center justify-center">
                  <img src={Logo} alt='Unipass Logo' className='h-10 w-10' />
                </div>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Unipass
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {/* Navigation Links */}
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Profile
              </Link>
              <Link
                to="/apps"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                My Apps
              </Link>
              <Link
                to="/admin/apps"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Admin
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}
                `}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* User */}
              <div className="flex items-center gap-3">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user?.name || user?.email}
                </span>
                <Button size="sm" variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`
            md:hidden border-t
            ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}
          `}>
            <div className="px-4 py-4 space-y-3">
              <Link to="/dashboard" className="block" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className="block" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/apps" className="block" onClick={() => setIsMenuOpen(false)}>
                My Apps
              </Link>
              <Link to="/admin/apps" className="block" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
              <button
                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                className="block w-full text-left"
              >
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="block w-full text-left text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;