// Vitest setup file - polyfills browser APIs not provided by jsdom.
import { afterEach } from 'vitest';
import React from 'react';

// React 19 moved `act` out of the main React export. @testing-library/react
// still relies on `React.act` being defined, so we polyfill it here.
if (typeof (React as unknown as { act?: unknown }).act === 'undefined') {
  (React as unknown as { act: unknown }).act = (callback: unknown) => {
    if (typeof callback === 'function') {
      callback();
    }
    return undefined;
  };
}

// jsdom does not implement matchMedia or a persistent localStorage in all
// configurations, so we provide lightweight implementations for the tests.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// Ensure a working localStorage (some Node versions require a file path).
if (typeof localStorage === 'undefined' || localStorage === null) {
  const store = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    length: store.size,
  } as Storage;
}

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});