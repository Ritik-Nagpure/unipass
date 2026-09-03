import React from 'react';

interface MenuIconMobileProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export const MenuIconMobile: React.FC<MenuIconMobileProps> = ({
  isOpen,
  onClick,
  className = '',
  ariaLabel = 'Toggle menu',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex md:hidden flex-col items-center justify-center w-8 h-8 space-y-1.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg ${className}`}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
    >
      <span
        className={`block w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  );
};