import React from 'react';

interface CardWebProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const CardWeb: React.FC<CardWebProps> = ({
  children,
  title,
  className = '',
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      className={`hidden md:block bg-card-bg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${hoverable ? 'hover:scale-[1.02]' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={title}
    >
      {title && (
        <div className="px-6 py-4 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};