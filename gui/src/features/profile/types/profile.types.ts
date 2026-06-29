export interface ProfileData {
  id: number;
  userId: number;
  username?: string | null;
  displayName?: string | null;
  avatar?: string | null;
  phone?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  company?: string | null;
  title?: string | null;
  socialLinks?: {
    twitter?: string | null;
    linkedin?: string | null;
    github?: string | null;
  };
  preferences?: {
    theme?: 'light' | 'dark';
    language?: 'en' | 'es' | 'fr' | 'de';
    notifications?: boolean;
  };
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateProfileData = Partial<Omit<ProfileData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;