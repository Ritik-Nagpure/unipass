import React from 'react';

interface MenuIconWebProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export const MenuIconWeb: React.FC<MenuIconWebProps> = ({
  isOpen,
  onClick,
  className = '',
  ariaLabel = 'Toggle menu',
}) => {
  return (
    <button
      onClick={onClick}
      className={`hidden md:flex items-center justify-center w-10 h-10 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
    >
      <div className="relative w-6 h-6">
        <span
          className={`absolute left-0 w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
            isOpen ? 'rotate-45 top-3' : 'top-1'
          }`}
        />
        <span
          className={`absolute left-0 w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'top-3'
          }`}
        />
        <span
          className={`absolute left-0 w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
            isOpen ? '-rotate-45 top-3' : 'top-5'
          }`}
        />
      </div>
    </button>
  );
};