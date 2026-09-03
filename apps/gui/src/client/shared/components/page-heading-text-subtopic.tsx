import React from 'react';

interface PageHeadingSubTopicProps {
  text: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  style?: 'normal' | 'italic' | 'underline';
  className?: string;
  as?: 'h3' | 'h4' | 'h5' | 'h6';
}

export const PageHeadingSubTopic: React.FC<PageHeadingSubTopicProps> = ({
  text,
  size = 'md',
  color = 'text-gray-700 dark:text-gray-300',
  style = 'normal',
  className = '',
  as: Tag = 'h3',
}) => {
  const sizeClasses = {
    xs: 'text-xs md:text-sm',
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
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