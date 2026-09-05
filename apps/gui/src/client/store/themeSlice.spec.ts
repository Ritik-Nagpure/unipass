import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { toggleTheme, setTheme } from './themeSlice';

describe('themeSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('starts in light mode by default', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual({ mode: 'light' });
  });

  it('toggles from light to dark and applies the theme', () => {
    const state = reducer({ mode: 'light' }, toggleTheme());
    expect(state.mode).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles from dark back to light', () => {
    const state = reducer({ mode: 'dark' }, toggleTheme());
    expect(state.mode).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('sets an explicit theme', () => {
    const state = reducer({ mode: 'light' }, setTheme('dark'));
    expect(state.mode).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('reads the stored theme when the module is (re)loaded', async () => {
    localStorage.setItem('theme', 'dark');
    vi.resetModules();
    const freshModule = await import('./themeSlice');
    expect(freshReducerMode(freshModule)).toBe('dark');
  });

  it('falls back to light when the stored value is invalid', async () => {
    localStorage.setItem('theme', 'blue');
    vi.resetModules();
    const freshModule = await import('./themeSlice');
    expect(freshReducerMode(freshModule)).toBe('light');
  });
});

const freshReducerMode = (mod: typeof import('./themeSlice')) =>
  mod.default(undefined, { type: 'init' }).mode;