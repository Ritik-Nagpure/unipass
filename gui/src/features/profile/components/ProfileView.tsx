import React from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { type ProfileData } from '../types/profile.types';

interface ProfileViewProps {
  profile: ProfileData;
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onEdit }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const labelClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const secondaryClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';

  const getInitials = (): string => {
    const name = profile?.displayName || profile?.username || profile?.email || 'U';
    if (name && name.includes(' ')) {
      const parts = name.split(' ');
      const first = parts[0] ? parts[0][0] : '';
      const second = parts[1] ? parts[1][0] : '';
      return (first + second).toUpperCase();
    }
    return name ? name[0].toUpperCase() : 'U';
  };

  const fields: Array<[string, string | null | undefined]> = [
    ['Display Name', profile?.displayName],
    ['Username', profile?.username],
    ['Email', profile?.email],
    ['Phone', profile?.phone],
    ['Location', profile?.location],
    ['Company', profile?.company],
    ['Job Title', profile?.title],
  ];

  return (
    <Card title="Profile" subtitle="View your profile information">
      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.displayName || 'Profile'}
              className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover"
            />
          ) : (
            <div
              className={`flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-500 text-5xl font-bold ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {getInitials()}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([title, value]) => (
            <div key={title}>
              <label className={`text-sm font-medium ${labelClass}`}>{title}</label>
              <p className={`text-base ${textClass}`}>{value || 'Not set'}</p>
            </div>
          ))}

          <div>
            <label className={`text-sm font-medium ${labelClass}`}>Website</label>
            <p className={`text-base ${textClass}`}>
              {profile?.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profile.website}
                </a>
              ) : (
                'Not set'
              )}
            </p>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div>
            <label className={`text-sm font-medium ${labelClass}`}>Bio</label>
            <p className={`mt-1 ${textClass}`}>{profile.bio}</p>
          </div>
        )}

        {/* Social Links */}
        {profile?.socialLinks && 
          (profile.socialLinks.twitter || profile.socialLinks.linkedin || profile.socialLinks.github) && (
          <div>
            <label className={`text-sm font-medium ${labelClass}`}>Social Links</label>
            <div className="mt-2 flex flex-wrap gap-4">
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 hover:underline"
                >
                  Twitter
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:underline dark:text-gray-400"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        )}

        {/* Preferences */}
        {profile?.preferences && (
          <div>
            <label className={`text-sm font-medium ${labelClass}`}>Preferences</label>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <p className={secondaryClass}>
                <strong>Theme:</strong> {profile.preferences.theme || 'Light'}
              </p>
              <p className={secondaryClass}>
                <strong>Language:</strong> {profile.preferences.language || 'English'}
              </p>
              <p className={secondaryClass}>
                <strong>Notifications:</strong> {profile.preferences.notifications ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`flex justify-end border-t pt-4 ${borderClass}`}>
          <Button onClick={onEdit}>Edit Profile</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileView;