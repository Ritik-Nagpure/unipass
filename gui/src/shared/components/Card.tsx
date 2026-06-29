import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  hover = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`
      rounded-xl shadow-md overflow-hidden transition-all
      ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
      ${hover ? `transform hover:scale-[1.02] transition-transform ${
        isDark ? 'hover:shadow-xl' : 'hover:shadow-lg'
      }` : ''}
      ${className}
    `}>
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {title && (
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={`px-6 py-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;