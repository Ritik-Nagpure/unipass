import React from 'react';

interface CollapsedListSubItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  depth?: number;
  as?: 'li' | 'div';
}

export const CollapsedListSubItem: React.FC<CollapsedListSubItemProps> = ({
  children,
  icon,
  className = '',
  onClick,
  active = false,
  depth = 1,
  as: Tag = 'li',
}) => {
  const depthClasses = {
    1: 'pl-8',
    2: 'pl-12',
    3: 'pl-16',
  };

  const depthPadding = depthClasses[depth as keyof typeof depthClasses] || depthClasses[1];

  return (
    <Tag
      className={`flex items-center gap-3 ${depthPadding} px-4 py-2 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-current={active ? 'page' : undefined}
    >
      {icon && <span className="shrink-0 text-sm">{icon}</span>}
      <span className="flex-1 text-sm">{children}</span>
    </Tag>
  );
};