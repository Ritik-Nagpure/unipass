import React from 'react';

interface ButtonWebProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const ButtonWeb: React.FC<ButtonWebProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  ariaLabel,
  type = 'button',
}) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-text-inverse',
    secondary: 'bg-bg-tertiary hover:bg-secondary-light text-text-primary',
    outline: 'border-2 border-primary hover:bg-primary-light/30 text-primary-dark',
    ghost: 'hover:bg-bg-secondary text-text-secondary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
      className={`hidden md:inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};