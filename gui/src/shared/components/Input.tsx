import React, { forwardRef } from 'react';
import { useTheme } from '../theme/ThemeProvider';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-sm font-medium mb-1 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          w-full px-4 py-2 rounded-lg border transition-colors
          ${isDark ? 
            'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500' : 
            'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }
          ${error ? 
            isDark ? 'border-red-600' : 'border-red-500' 
            : ''
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && (
        <p className={`mt-1 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      )}
      {helper && !error && (
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;