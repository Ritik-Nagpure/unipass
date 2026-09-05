// ========================================
// COOKIE UTILITIES
// ========================================

export const setCookie = (
  name: string,
  value: string,
  days = 30,
  path = '/'
) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return null;
};

export const deleteCookie = (name: string, path = '/') => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
};

// ========================================
// AUTH COOKIE HELPERS
// ========================================
export const AUTH_COOKIE_NAME = 'unipass_auth';

export const setAuthCookie = (token: string, days = 30) => {
  setCookie(AUTH_COOKIE_NAME, token, days);
};

export const getAuthCookie = (): string | null => {
  return getCookie(AUTH_COOKIE_NAME);
};

export const clearAuthCookie = () => {
  deleteCookie(AUTH_COOKIE_NAME);
};