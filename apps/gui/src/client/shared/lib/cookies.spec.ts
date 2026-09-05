import { describe, it, expect, beforeEach } from 'vitest';
import { setCookie, getCookie, deleteCookie, setAuthCookie, getAuthCookie, clearAuthCookie } from './cookies';

describe('cookies lib', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  });

  it('sets, reads, and deletes a cookie', () => {
    setCookie('greeting', 'hello', 7);
    expect(getCookie('greeting')).toBe('hello');

    deleteCookie('greeting');
    expect(getCookie('greeting')).toBeNull();
  });

  it('encodes and decodes values with special characters', () => {
    setCookie('data', 'a=b&c=d?e', 1);
    expect(getCookie('data')).toBe('a=b&c=d?e');
  });

  it('returns null for a missing cookie', () => {
    expect(getCookie('nope')).toBeNull();
  });

  it('auth cookie helpers use the shared cookie name', () => {
    setAuthCookie('token-123', 1);
    expect(getAuthCookie()).toBe('token-123');

    clearAuthCookie();
    expect(getAuthCookie()).toBeNull();
  });
});