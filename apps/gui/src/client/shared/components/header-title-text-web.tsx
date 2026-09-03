import React from 'react';

interface HeaderTitleTextWebProps {
  title: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const HeaderTitleTextWeb: React.FC<HeaderTitleTextWebProps> = ({
  title,
  className = '',
  as: Tag = 'h1',
}) => {
  return (
    <Tag
      className={`hidden md:block text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200 ${className}`}
      aria-label={title}
    >
      {title}
    </Tag>
  );
};