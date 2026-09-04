// src/store/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): 'light' | 'dark' => {
  // Check localStorage first
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Apply theme immediately
      applyTheme(state.mode);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      applyTheme(state.mode);
    },
  },
});

// Helper function to apply theme
const applyTheme = (theme: 'light' | 'dark') => {
  // Set data attribute on html element
  document.documentElement.setAttribute('data-theme', theme);
  // Store in localStorage
  localStorage.setItem('theme', theme);
};

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;