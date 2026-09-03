import React from 'react';

interface PageHeadingTopicProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: 'normal' | 'italic' | 'underline';
  className?: string;
  as?: 'h2' | 'h3' | 'h4' | 'h5';
}

export const PageHeadingTopic: React.FC<PageHeadingTopicProps> = ({
  text,
  size = 'lg',
  color = 'text-blue-600 dark:text-blue-400',
  style = 'normal',
  className = '',
  as: Tag = 'h2',
}) => {
  const sizeClasses = {
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
  };

  const styleClasses = {
    normal: 'font-medium',
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