import React from 'react';

interface PageHeadingIndexProps {
  text: string | number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  style?: 'normal' | 'italic' | 'underline';
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export const PageHeadingIndex: React.FC<PageHeadingIndexProps> = ({
  text,
  size = 'sm',
  color = 'text-gray-500 dark:text-gray-400',
  style = 'normal',
  className = '',
  as: Tag = 'span',
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const styleClasses = {
    normal: 'font-normal',
    italic: 'italic',
    underline: 'underline underline-offset-4',
  };

  return (
    <Tag
      className={`${sizeClasses[size]} ${color} ${styleClasses[style]} transition-colors duration-200 ${className}`}
    >
      {text}
    </Tag>
  );
};