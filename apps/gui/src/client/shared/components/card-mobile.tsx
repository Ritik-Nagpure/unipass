import React from 'react';

interface CardMobileProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const CardMobile: React.FC<CardMobileProps> = ({
  children,
  title,
  className = '',
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      className={`block md:hidden bg-card-bg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${hoverable ? 'active:scale-[0.98]' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={title}
    >
      {title && (
        <div className="px-4 py-3 border-b border-border-light">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};