// src/pages/Changelog.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const Changelog: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changes = [
    {
      version: '2.4.0',
      date: 'January 15, 2026',
      type: 'major',
      changes: [
        '✨ New: Passwordless authentication support',
        '🚀 Feature: Biometric login for mobile apps',
        '🔒 Security: Enhanced encryption algorithms',
        '🎨 UI: Complete design system overhaul',
        '🐛 Fix: Resolved sync issues across devices'
      ]
    },
    {
      version: '2.3.2',
      date: 'December 20, 2025',
      type: 'patch',
      changes: [
        '🐛 Fix: Fixed memory leak in sync engine',
        '📱 Mobile: Improved performance on iOS',
        '🔧 Config: Updated default security settings'
      ]
    },
    {
      version: '2.3.0',
      date: 'December 5, 2025',
      type: 'minor',
      changes: [
        '✨ New: Team sharing capabilities',
        '📊 Feature: Security dashboard v2',
        '🔗 Integration: Slack integration',
        '🎨 UI: Dark theme improvements'
      ]
    },
    {
      version: '2.2.0',
      date: 'November 15, 2025',
      type: 'minor',
      changes: [
        '✨ New: Password health checker',
        '📱 Mobile: Native apps for iOS and Android',
        '🔒 Security: 2FA improvements'
      ]
    },
    {
      version: '2.0.0',
      date: 'October 1, 2025',
      type: 'major',
      changes: [
        '🚀 Major: Complete rewrite',
        '🔒 Security: Zero-knowledge architecture',
        '⚡ Performance: 10x faster sync',
        '🎨 UI: New design system'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">

      {/* Page Header */}
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Changelog icon">📦</span>
            <div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                📦 Latest Release: v2.4.0
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Changelog</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">All updates and improvements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Changelog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-8">
          {changes.map((release, index) => (
            <div 
              key={index}
              className="bg-card-bg rounded-xl border border-border p-6 md:p-8 hover:shadow-card transition-all duration-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      release.type === 'major' 
                        ? 'bg-primary text-white' 
                        : release.type === 'minor'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-bg-tertiary text-text-secondary'
                    }`}>
                      {release.type.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold text-text-primary">v{release.version}</h3>
                  </div>
                  <p className="mt-1 text-text-secondary text-sm">{release.date}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {release.changes.map((change, idx) => (
                  <li key={idx} className="text-text-secondary text-sm leading-relaxed">
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Changelog;