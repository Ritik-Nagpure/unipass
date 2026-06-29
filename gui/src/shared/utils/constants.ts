export const APP_NAME = 'Unipass';
export const APP_VERSION = '1.0.0';

export const API_BASE = '/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  APPS: '/apps',
  ADMIN: '/admin/apps',
} as const;

export const STORAGE_KEYS = {
  THEME: 'unipass-theme',
  LANGUAGE: 'unipass-language',
  ACCESS_TOKEN: 'unipass-access-token',
  REFRESH_TOKEN: 'unipass-refresh-token',
} as const;

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'] as const;
export const SUPPORTED_THEMES = ['light', 'dark'] as const;