import React from 'react';

interface HeaderTitleTextMobileProps {
  title: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const HeaderTitleTextMobile: React.FC<HeaderTitleTextMobileProps> = ({
  title,
  className = '',
  as: Tag = 'h1',
}) => {
  return (
    <Tag
      className={`block md:hidden text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200 ${className}`}
      aria-label={title}
    >
      {title}
    </Tag>
  );
};