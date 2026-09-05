import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  setLoading,
  setError,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
} from './authSlice';
import { AUTH_COOKIE_NAME, setCookie } from '../shared/lib/cookies';

const user = {
  id: 'u-1',
  email: 'jane@example.com',
  name: 'Jane Doe',
  role: 'user',
};

describe('authSlice', () => {
  beforeEach(() => {
    document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });

  it('is unauthenticated when no marker cookie exists', () => {
    const state = reducer(undefined, { type: 'init' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('is authenticated when the marker cookie exists', async () => {
    setCookie(AUTH_COOKIE_NAME, 'marker', 1);
    vi.resetModules();
    const freshModule = await import('./authSlice');
    const state = freshModule.default(undefined, { type: 'init' });
    expect(state.isAuthenticated).toBe(true);
  });

  it('loginStart sets loading and clears errors', () => {
    const state = reducer({ user: null, isAuthenticated: false, isLoading: false, error: 'boom' }, loginStart());
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginSuccess stores the user and sets the client marker cookie', () => {
    const state = reducer(undefined, loginSuccess({ user }));
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(document.cookie).toContain(AUTH_COOKIE_NAME);
  });

  it('loginFailure records the error', () => {
    const state = reducer(undefined, loginFailure('Invalid credentials'));
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Invalid credentials');
    expect(state.isLoading).toBe(false);
  });

  it('logout clears the user and marker cookie', () => {
    setCookie(AUTH_COOKIE_NAME, 'marker', 1);
    let state = reducer(undefined, loginSuccess({ user }));
    state = reducer(state, logout());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(document.cookie).not.toContain(`${AUTH_COOKIE_NAME}=marker`);
  });

  it('updateUser patches the stored user', () => {
    let state = reducer(undefined, loginSuccess({ user }));
    state = reducer(state, updateUser({ name: 'Jane Smith' }));
    expect(state.user?.name).toBe('Jane Smith');
    expect(state.user?.email).toBe('jane@example.com');
  });

  it('setLoading / setError / clearError manage transient state', () => {
    let state = reducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);

    state = reducer(state, setError('oops'));
    expect(state.error).toBe('oops');
    expect(state.isLoading).toBe(false);

    state = reducer(state, clearError());
    expect(state.error).toBeNull();
  });
});