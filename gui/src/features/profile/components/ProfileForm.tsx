import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { useProfile } from '../hooks/useProfile';
import { type ProfileData } from '../types/profile.types';
import { profileService } from '../services/profile.service';

interface ProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onCancel, onSuccess }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile, loading, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    displayName: '',
    username: '',
    phone: '',
    bio: '',
    website: '',
    location: '',
    company: '',
    title: '',
    avatar: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
    },
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [croppedAvatar, setCroppedAvatar] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        username: profile.username || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        company: profile.company || '',
        title: profile.title || '',
        avatar: profile.avatar || '',
        socialLinks: profile.socialLinks || {
          twitter: '',
          linkedin: '',
          github: '',
        },
        preferences: profile.preferences || {
          theme: 'light',
          language: 'en',
          notifications: true,
        },
      });
      setAvatarPreview(profile.avatar || null);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        const parentKey = parent as keyof ProfileData;
        const parentValue = prev[parentKey];
        
        if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
          return {
            ...prev,
            [parentKey]: {
              ...(parentValue as Record<string, unknown>),
              [child]: value,
            },
          };
        }
        
        return {
          ...prev,
          [parentKey]: {
            [child]: value,
          },
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please choose an image file.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCropSource(reader.result as string);
        setCropScale(1);
        setCropX(0);
        setCropY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyAvatarCrop = async () => {
    const image = cropImageRef.current;
    if (!image || !cropSource) return;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return;

    const baseScale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
    const scale = baseScale * cropScale;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const x = (size - width) / 2 + cropX * 2;
    const y = (size - height) / 2 + cropY * 2;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, size, size);
    context.drawImage(image, x, y, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setAvatarPreview(dataUrl);
    setCroppedAvatar(dataUrl);
    setCropSource(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let dataToSave = formData;
      if (croppedAvatar) {
        const uploaded = await profileService.uploadAvatar(croppedAvatar);
        dataToSave = { ...formData, avatar: uploaded.url };
        setFormData((prev) => ({ ...prev, avatar: uploaded.url }));
        setCroppedAvatar(null);
      }

      await updateProfile(dataToSave);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (): string => {
    const name = formData?.displayName || formData?.username || profile?.email || 'U';
    if (name && name.includes(' ')) {
      const parts = name.split(' ');
      const first = parts[0] ? parts[0][0] : '';
      const second = parts[1] ? parts[1][0] : '';
      return (first + second).toUpperCase();
    }
    return name ? name[0].toUpperCase() : 'U';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card title="Edit Profile" subtitle="Update your personal information">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-4 rounded-lg text-sm ${
              message.type === 'success' 
                ? isDark ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'
                : isDark ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <div 
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                } border-4 border-blue-500`}
              >
                {getInitials()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">Change Photo</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Click to upload a new profile picture (PNG, JPG, GIF)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            name="displayName"
            value={formData.displayName || ''}
            onChange={handleChange}
            placeholder="John Doe"
            fullWidth
          />
          <Input
            label="Username"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            placeholder="johndoe"
            fullWidth
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            fullWidth
          />
          <Input
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://example.com"
            fullWidth
          />
          <Input
            label="Location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            fullWidth
          />
          <Input
            label="Company"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
            placeholder="Acme Inc."
            fullWidth
          />
          <Input
            label="Job Title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Software Engineer"
            fullWidth
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              isDark ? 
                'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500' : 
                'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="border-t pt-4">
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Social Links
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Twitter"
              name="socialLinks.twitter"
              value={formData.socialLinks?.twitter || ''}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              fullWidth
            />
            <Input
              label="LinkedIn"
              name="socialLinks.linkedin"
              value={formData.socialLinks?.linkedin || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              fullWidth
            />
            <Input
              label="GitHub"
              name="socialLinks.github"
              value={formData.socialLinks?.github || ''}
              onChange={handleChange}
              placeholder="https://github.com/username"
              fullWidth
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Preferences
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Theme Preference
              </label>
              <select
                name="preferences.theme"
                value={formData.preferences?.theme || 'light'}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDark ? 
                    'bg-gray-800 border-gray-700 text-gray-200' : 
                    'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Language
              </label>
              <select
                name="preferences.language"
                value={formData.preferences?.language || 'en'}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDark ? 
                    'bg-gray-800 border-gray-700 text-gray-200' : 
                    'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences?.notifications || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: checked,
                      },
                    }));
                  }}
                  className={`w-4 h-4 rounded border transition-colors ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enable email notifications
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
      {cropSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className={`w-full max-w-md rounded-lg p-5 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
            <h3 className="text-lg font-semibold mb-4">Crop profile picture</h3>
            <div className="mx-auto h-64 w-64 overflow-hidden rounded-full border-4 border-blue-500 bg-gray-200">
              <img
                ref={cropImageRef}
                src={cropSource}
                alt="Crop preview"
                className="h-full w-full object-contain"
                style={{
                  transform: `translate(${cropX}px, ${cropY}px) scale(${cropScale})`,
                  transformOrigin: 'center',
                }}
              />
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-medium">
                Zoom
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => setCropScale(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
              <label className="block text-sm font-medium">
                Horizontal
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={cropX}
                  onChange={(e) => setCropX(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
              <label className="block text-sm font-medium">
                Vertical
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={cropY}
                  onChange={(e) => setCropY(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setCropSource(null)}>
                Cancel
              </Button>
              <Button onClick={applyAvatarCrop}>
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileForm;
