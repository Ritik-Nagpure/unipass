import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { setTheme } from '../../../store/themeSlice';

const themes: Array<{ value: 'light' | 'dark'; label: string; icon: string }> = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
];

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="py-6 space-y-8 max-w-3xl mx-auto" data-testid="settings-page">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Customize your UniPass experience</p>
      </div>

      {/* Appearance */}
      <section className="bg-card-bg rounded-2xl border border-border p-6 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Appearance</h3>
        <p className="text-text-secondary text-sm">Choose how UniPass looks to you.</p>

        <div className="grid sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Theme selection">
          {themes.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={theme === option.value}
              onClick={() => dispatch(setTheme(option.value))}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                theme === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-bg-secondary text-text-secondary hover:border-primary'
              }`}
              data-testid={`theme-${option.value}`}
            >
              <span className="text-2xl" role="img" aria-label={`${option.label} theme`}>
                {option.icon}
              </span>
              <span className="font-semibold">{option.label}</span>
              {theme === option.value && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Account */}
      <section className="bg-card-bg rounded-2xl border border-border p-6 shadow-card space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">Account</h3>
        {user ? (
          <div className="text-sm text-text-secondary space-y-1">
            <p>
              <span className="font-medium text-text-primary">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium text-text-primary">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium text-text-primary">Role:</span> {user.role}
            </p>
          </div>
        ) : (
          <p className="text-text-secondary text-sm">Not signed in.</p>
        )}
      </section>
    </div>
  );
};

export default SettingsPage;