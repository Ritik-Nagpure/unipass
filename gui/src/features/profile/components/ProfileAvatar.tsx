import React, { useState, useRef } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useProfile } from '../hooks/useProfile';

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onAvatarChange?: (file: File) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  size = 'md',
  editable = false,
  onAvatarChange,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useProfile();
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-32 h-32 text-4xl',
    xl: 'w-48 h-48 text-6xl',
  };

  const getInitials = () => {
    const name = profile?.displayName || profile?.username || profile?.email || 'U';
    if (name.includes(' ')) {
      const parts = name.split(' ');
      return parts[0][0] + parts[1][0];
    }
    return name[0]?.toUpperCase() || 'U';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center relative
          ${profile?.avatar ? 'overflow-hidden' : ''}
          ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}
          ${editable ? 'cursor-pointer' : ''}
          transition-all duration-200
          ${hover && editable ? 'opacity-80' : ''}
        `}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleClick}
      >
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.displayName || 'Avatar'}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="font-bold">{getInitials()}</span>
        )}
      </div>

      {editable && hover && (
        <div className={`
          absolute inset-0 rounded-full flex items-center justify-center
          bg-black bg-opacity-40 cursor-pointer
          ${sizeClasses[size]}
        `}>
          <span className="text-white text-sm font-medium">
            {profile?.avatar ? 'Change' : 'Upload'}
          </span>
        </div>
      )}

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  );
};

export default ProfileAvatar;