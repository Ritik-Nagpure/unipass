import React, { useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: isDark ? 'bg-green-900 text-green-200 border-green-800' : 'bg-green-50 text-green-800 border-green-200',
    error: isDark ? 'bg-red-900 text-red-200 border-red-800' : 'bg-red-50 text-red-800 border-red-200',
    warning: isDark ? 'bg-yellow-900 text-yellow-200 border-yellow-800' : 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: isDark ? 'bg-blue-900 text-blue-200 border-blue-800' : 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg border shadow-lg
      animate-slide-in-right
      ${typeStyles[type]}
    `}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[type]}</span>
        <p className="flex-1 text-sm">{message}</p>
        <button
          onClick={onClose}
          className={`text-sm hover:opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;