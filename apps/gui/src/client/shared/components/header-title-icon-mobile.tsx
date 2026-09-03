import React from 'react';

interface HeaderTitleIconMobileProps {
  icon: React.ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const HeaderTitleIconMobile: React.FC<HeaderTitleIconMobileProps> = ({
  icon,
  label = 'icon',
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`flex md:hidden items-center justify-center w-8 h-8 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${className}`}
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