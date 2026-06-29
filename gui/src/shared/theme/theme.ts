export const themeConfig = {
  light: {
    colors: {
      background: {
        primary: '#ffffff',
        secondary: '#f3f4f6',
        tertiary: '#e5e7eb',
        input: '#ffffff',
      },
      text: {
        primary: '#111827',
        secondary: '#374151',
        tertiary: '#6b7280',
        inverse: '#ffffff',
      },
      border: {
        primary: '#e5e7eb',
        secondary: '#d1d5db',
      },
      brand: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      status: {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
  },
  dark: {
    colors: {
      background: {
        primary: '#111827',
        secondary: '#1f2937',
        tertiary: '#374151',
        input: '#1f2937',
      },
      text: {
        primary: '#f9fafb',
        secondary: '#e5e7eb',
        tertiary: '#9ca3af',
        inverse: '#111827',
      },
      border: {
        primary: '#374151',
        secondary: '#4b5563',
      },
      brand: {
        50: '#1e3a8a',
        100: '#1e40af',
        200: '#1d4ed8',
        300: '#2563eb',
        400: '#3b82f6',
        500: '#60a5fa',
        600: '#93c5fd',
        700: '#bfdbfe',
        800: '#dbeafe',
        900: '#eff6ff',
      },
      status: {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    },
  },
};

export type ThemeConfig = typeof themeConfig;