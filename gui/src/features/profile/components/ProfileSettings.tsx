import React, { useState } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';
import { useProfile } from '../hooks/useProfile';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

const ProfileSettings: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile, loading } = useProfile();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        No profile data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isEditing ? (
        <ProfileForm 
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <ProfileView 
          profile={profile} 
          onEdit={() => setIsEditing(true)} 
        />
      )}
    </div>
  );
};

export default ProfileSettings;