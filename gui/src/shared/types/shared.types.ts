export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  filter?: Record<string, any>;
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface UserPreferences {
  theme: Theme;
  language: Language;
  notifications: boolean;
}

export interface SocialLinks {
  twitter?: string | null;
  linkedin?: string | null;
  github?: string | null;
}