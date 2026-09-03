import React from 'react';

interface HeaderTitleIconWebProps {
  icon: React.ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const HeaderTitleIconWeb: React.FC<HeaderTitleIconWebProps> = ({
  icon,
  label = 'icon',
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`hidden md:flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${className}`}
      role={onClick ? 'button' : 'img'}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon}
    </div>
  );
};