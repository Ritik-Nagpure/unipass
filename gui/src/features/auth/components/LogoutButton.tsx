import React from 'react';
import Button from '../../../shared/components/Button';
import { useAuth } from '../hooks/useAuth';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'danger',
  size = 'md',
  className = '',
}) => {
  const { logout, loading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      onClick={logout}
      className={className}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;