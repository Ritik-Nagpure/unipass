import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import { type ProfileData, type UpdateProfileData } from '../types/profile.types';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};