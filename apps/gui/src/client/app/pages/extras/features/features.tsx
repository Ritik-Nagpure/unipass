// src/pages/Features.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

interface Feature {
  icon: string;
  iconLabel: string;
  title: string;
  description: string;
  tag: string;
}

const Features: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const features: Feature[] = [
    {
      icon: '🔐',
      iconLabel: 'Padlock icon - zero-knowledge encryption',
      title: 'Zero-Knowledge Encryption',
      description: 'Your data is encrypted locally before it ever reaches our servers. We never have access to your master password or decrypted data.',
      tag: 'AES-256-GCM'
    },
    {
      icon: '⚡',
      iconLabel: 'Lightning bolt icon - instant authentication',
      title: 'Instant SSO Authentication',
      description: 'One click to access all your applications. Lightning-fast authentication with zero latency and seamless integration.',
      tag: '99.9% Uptime'
    },
    {
      icon: '🛡️',
      iconLabel: 'Shield icon - zero-trust security',
      title: 'Zero-Trust Security',
      description: 'Every request is verified. Every session is encrypted. Complete peace of mind with our zero-trust architecture.',
      tag: 'SOC 2 Compliant'
    },
    {
      icon: '🌐',
      iconLabel: 'Globe icon - cross-platform sync',
      title: 'Cross-Platform Sync',
      description: 'Access your vault anywhere. Seamless sync across all your devices in real-time with end-to-end encryption.',
      tag: 'Works Everywhere'
    },
    {
      icon: '👥',
      iconLabel: 'People icon - team collaboration',
      title: 'Team Collaboration',
      description: 'Share access securely with your team. Granular permission controls for every role and department.',
      tag: 'RBAC'
    },
    {
      icon: '📱',
      iconLabel: 'Mobile phone icon - mobile-first design',
      title: 'Mobile-First Design',
      description: 'Beautiful, responsive interface that works flawlessly on smartphones, tablets, and desktops.',
      tag: 'Responsive'
    },
    {
      icon: '🔑',
      iconLabel: 'Key icon - password generator',
      title: 'Smart Password Generator',
      description: 'Create strong, unique passwords for every account with our built-in generator that follows best-practice security guidelines.',
      tag: 'Secure'
    },
    {
      icon: '🔄',
      iconLabel: 'Refresh icon - automatic sync',
      title: 'Automatic Sync',
      description: 'Changes sync automatically across all your devices. No manual updates needed. Always up-to-date.',
      tag: 'Real-time'
    },
    {
      icon: '📊',
      iconLabel: 'Chart icon - security dashboard',
      title: 'Security Dashboard',
      description: 'Monitor your security status with detailed analytics, security reports, and actionable insights.',
      tag: 'Analytics'
    },
    {
      icon: '🔔',
      iconLabel: 'Bell icon - smart alerts',
      title: 'Smart Alerts',
      description: 'Get real-time notifications for suspicious activity, password breaches, and security events.',
      tag: 'Monitoring'
    },
    {
      icon: '🧩',
      iconLabel: 'Puzzle piece icon - browser extension',
      title: 'Browser Extension',
      description: 'Seamless integration with all major browsers for one-click autofill and password management.',
      tag: 'Extension'
    },
    {
      icon: '☁️',
      iconLabel: 'Cloud icon - cloud backup',
      title: 'Cloud Backup',
      description: 'Your encrypted vault is automatically backed up to the cloud with multiple redundancy layers.',
      tag: 'Backup'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">

      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span 
              className="text-4xl" 
              role="img" 
              aria-label="Rocket icon - features page"
            >
              🚀
            </span>
            <div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                ✨ Powerful Features
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
                Everything You Need
              </h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">
                Built for modern teams. Designed for security. Loved by users.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-bg-secondary p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-primary">10K+</div>
            <div className="text-sm text-text-secondary">Active Users</div>
          </div>
          <div className="bg-bg-secondary p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-primary">50K+</div>
            <div className="text-sm text-text-secondary">Passwords Managed</div>
          </div>
          <div className="bg-bg-secondary p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-text-secondary">Uptime</div>
          </div>
          <div className="bg-bg-secondary p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-primary">4.8⭐</div>
            <div className="text-sm text-text-secondary">User Rating</div>
          </div>
        </div>

        {/* Features - Fixed: Added role="img" and aria-label to emojis */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card-bg p-6 rounded-xl border border-border hover:border-primary hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
            >
              <span 
                className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300"
                role="img"
                aria-label={feature.iconLabel}
              >
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {feature.tag}
                </span>
                <a 
                  href={`/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:underline"
                  aria-label={`Learn more about ${feature.title}`}
                >
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section - Fixed: Changed bg-gradient-to-br to bg-linear-to-br */}
        <div className="mt-16 bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-6">
            Join thousands of teams already using UniPass to secure their authentication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup"
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 hover:shadow-heavy text-center"
            >
              Start Free Trial
            </a>
            <a 
              href="/docs"
              className="px-8 py-3 bg-bg-secondary text-text-primary font-semibold rounded-lg border border-border hover:border-primary transition-all duration-200 text-center"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Features;