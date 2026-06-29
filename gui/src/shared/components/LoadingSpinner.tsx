import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-4 rounded-full animate-spin
          ${isDark ? 'border-gray-700 border-t-blue-500' : 'border-gray-200 border-t-blue-600'}
        `}
      />
    </div>
  );
};

export default LoadingSpinner;