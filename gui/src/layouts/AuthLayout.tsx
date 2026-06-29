import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../shared/theme/ThemeProvider';

const AuthLayout: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-3xl font-bold">U</span>
              </div>
            </div>
            <h1 className={`mt-4 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Unipass
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Single Sign-On Platform
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;