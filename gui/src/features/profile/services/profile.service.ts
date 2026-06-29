import { type ProfileData, type UpdateProfileData } from '../types/profile.types';

const API_BASE = '/api/profile';

export const profileService = {
  async getProfile(): Promise<ProfileData> {
    const response = await fetch(`${API_BASE}/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  async updateProfile(data: UpdateProfileData): Promise<ProfileData> {
    const response = await fetch(`${API_BASE}/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  },

  async uploadAvatar(image: string): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE}/avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    return response.json();
  },
};
