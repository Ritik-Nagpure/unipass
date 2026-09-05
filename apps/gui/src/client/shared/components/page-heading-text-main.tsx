import React from 'react';

interface PageHeadingMainProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: string;
  style?: 'normal' | 'italic' | 'underline';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export const PageHeadingMain: React.FC<PageHeadingMainProps> = ({
  text,
  size = '2xl',
  color = 'text-text-primary',
  style = 'normal',
  className = '',
  as: Tag = 'h1',
}) => {
  const sizeClasses = {
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
    '2xl': 'text-2xl md:text-3xl',
    '3xl': 'text-3xl md:text-4xl',
    '4xl': 'text-4xl md:text-5xl',
  };

  const styleClasses = {
    normal: 'font-normal',
    italic: 'italic',
    underline: 'underline underline-offset-4',
  };

  return (
    <Tag
      className={`${sizeClasses[size]} ${color} ${styleClasses[style]} font-bold transition-colors duration-200 ${className}`}
    >
      {text}
    </Tag>
  );
};